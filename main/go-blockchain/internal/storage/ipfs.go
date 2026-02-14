package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/ipfs/boxo/blockstore"
	"github.com/ipfs/boxo/gateway"
	"github.com/ipfs/boxo/ipld/car"
	"github.com/ipfs/boxo/namesys"
	"github.com/ipfs/boxo/provider"
	"github.com/ipfs/boxo/routing"
	"github.com/ipfs/kubo/config"
	"github.com/ipfs/kubo/core"
	"github.com/ipfs/kubo/core/node/libp2p"
	"github.com/libp2p/go-libp2p"
	"github.com/libp2p/go-libp2p/core/metrics"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/multiformats/go-multiaddr"
)

type IPFSService struct {
	node       *core.IpfsNode
	gateway    *gateway.Server
	blockstore blockstore.Blockstore
}

type IPFSConfig struct {
	RepoPath      string
	ListenAddrs   []string
	GatewayAddrs  []string
	EnablePinning bool
}

type AddResult struct {
	CID       string
	Size      int64
	NumBlocks int
}

func NewIPFSService(ctx context.Context, cfg IPFSConfig) (*IPFSService, error) {
	if cfg.RepoPath == "" {
		cfg.RepoPath = filepath.Join(os.Getenv("HOME"), ".savy", "ipfs")
	}

	if len(cfg.ListenAddrs) == 0 {
		cfg.ListenAddrs = []string{
			"/ip4/127.0.0.1/tcp/4001",
			"/ip4/127.0.0.1/tcp/4002/ws",
		}
	}

	if len(cfg.GatewayAddrs) == 0 {
		cfg.GatewayAddrs = []string{
			"/ip4/127.0.0.1/tcp/8080",
		}
	}

	// Build libp2p host
	host, err := libp2p.New(
		libp2p.ListenAddrStrings(cfg.ListenAddrs...),
		libp2p.DisableRelay(),
		libp2p.Metrics(&metrics.Stats{}),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create libp2p host: %w", err)
	}

	// Create configuration
	ipfsConfig, err := config.Fill(&config.Config{
		Addresses: config.Addresses{
			Swarm:   cfg.ListenAddrs,
			Gateway: cfg.GatewayAddrs,
		},
		Bootstrap: config.BootstrapStrings{},
		Discovery: config.Discovery{
			MDNS: config.MDNS{
				Enabled: false,
			},
		},
		Routing: config.Routing{
			Type: "none",
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create config: %w", err)
	}

	// Create blockstore
	bs := blockstore.NewBlockstore(nil)

	// Create IPFS node
	node, err := core.NewNode(ctx, &core.BuildCfg{
		Online:     true,
		Host:       host,
		Blockstore: bs,
		Routing:    routing.NewNullRouting(),
		Config:     ipfsConfig,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create IPFS node: %w", err)
	}

	// Pinning service if enabled
	if cfg.EnablePinning {
		provider.NewPinning(node.Pinning, node.Blockstore, node.Datastore)
	}

	return &IPFSService{
		node:       node,
		blockstore: bs,
	}, nil
}

func (s *IPFSService) Add(ctx context.Context, data []byte) (*AddResult, error) {
	cid, err := s.node.Blockstore.Put(ctx, data)
	if err != nil {
		return nil, fmt.Errorf("failed to add data: %w", err)
	}

	return &AddResult{
		CID:       cid.String(),
		Size:      int64(len(data)),
		NumBlocks: 1,
	}, nil
}

func (s *IPFSService) AddFile(ctx context.Context, path string) (*AddResult, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	return s.Add(ctx, data)
}

func (s *IPFSService) Get(ctx context.Context, cid string) ([]byte, error) {
	return s.blockstore.Get(ctx, blockstore.CidFromString(cid))
}

func (s *IPFSService) Pin(ctx context.Context, cid string) error {
	// Implementation depends on pinning service
	return nil
}

func (s *IPFSService) Unpin(ctx context.Context, cid string) error {
	// Implementation depends on pinning service
	return nil
}

func (s *IPFSService) GetStats(ctx context.Context) (map[string]interface{}, error) {
	peers := s.node.PeerHost.Network().Peers()

	return map[string]interface{}{
		"peers":        len(peers),
		"provider":     "savy-neuro-data",
		"repo_version": "15",
		"num_objects":  0,
	}, nil
}

func (s *IPFSService) GetPeers(ctx context.Context) ([]peer.AddrInfo, error) {
	peers := s.node.PeerHost.Network().Peers()
	result := make([]peer.AddrInfo, len(peers))

	for i, p := range peers {
		addrInfo := s.node.PeerHost.Peerstore().PeerInfo(p)
		result[i] = addrInfo
	}

	return result, nil
}

func (s *IPFSService) ConnectToPeer(ctx context.Context, addr string) error {
	maddr, err := multiaddr.NewMultiaddr(addr)
	if err != nil {
		return fmt.Errorf("failed to parse multiaddr: %w", err)
	}

	peerInfo, err := peer.AddrInfoFromP2pAddr(maddr)
	if err != nil {
		return fmt.Errorf("failed to get peer info: %w", err)
	}

	return s.node.PeerHost.Connect(ctx, *peerInfo)
}

func (s *IPFSService) Close() error {
	if s.node != nil {
		s.node.Close()
	}
	return nil
}

// CAR serialization for batch data export
func (s *IPFSService) ExportCAR(ctx context.Context, cid string) ([]byte, error) {
	reader, err := car.NewCarReader(ctx, blockstore.CidFromString(cid), s.blockstore)
	if err != nil {
		return nil, fmt.Errorf("failed to create CAR reader: %w", err)
	}

	return io.ReadAll(reader)
}
