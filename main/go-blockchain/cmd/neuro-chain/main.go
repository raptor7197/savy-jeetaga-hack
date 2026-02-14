package main

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"os"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/your-project/neuro-chain/bindings"
)

type BlockchainService struct {
	client            *ethclient.Client
	auth              *bind.TransactOpts
	contracts         *ContractRegistry
	contractAddresses ContractAddresses
}

type ContractAddresses struct {
	ConsentManager    common.Address
	NeuroDataRegistry common.Address
	KeyRecovery       common.Address
}

type ContractRegistry struct {
	ConsentManager    *bindings.ConsentManager
	NeuroDataRegistry *bindings.NeuroDataRegistry
	KeyRecovery       *bindings.KeyRecovery
}

type ConsentRequest struct {
	Researcher   common.Address
	DataCID      string
	Purpose      uint8
	DurationDays uint64
	Signature    []byte
}

type DataRegistration struct {
	IPFSCID             string
	DataHash            [32]byte
	Size                uint64
	IsEncrypted         bool
	EncryptionAlgorithm string
	Metadata            NeuroDataRegistryDataMetadata
}

type NeuroDataRegistryDataMetadata struct {
	SessionID    string
	SampleRate   uint64
	ChannelCount uint64
	Duration     uint64
	Format       string
}

type Guardian struct {
	Address    common.Address
	Commitment []byte
}

func NewBlockchainService(rpcURL string, privateKeyHex string, contractAddrs ContractAddresses) (*BlockchainService, error) {
	client, err := ethclient.DialContext(context.Background(), rpcURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to RPC: %w", err)
	}

	privateKey, err := crypto.HexToECDSA(privateKeyHex)
	if err != nil {
		return nil, fmt.Errorf("invalid private key: %w", err)
	}

	chainID, err := client.ChainID(context.Background())
	if err != nil {
		return nil, fmt.Errorf("failed to get chain ID: %w", err)
	}

	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, chainID)
	if err != nil {
		return nil, fmt.Errorf("failed to create transactor: %w", err)
	}

	// Load contracts
	consentManager, err := bindings.NewConsentManager(contractAddrs.ConsentManager, client)
	if err != nil {
		return nil, fmt.Errorf("failed to load ConsentManager: %w", err)
	}

	neuroDataRegistry, err := bindings.NewNeuroDataRegistry(contractAddrs.NeuroDataRegistry, client)
	if err != nil {
		return nil, fmt.Errorf("failed to load NeuroDataRegistry: %w", err)
	}

	keyRecovery, err := bindings.NewKeyRecovery(contractAddrs.KeyRecovery, client)
	if err != nil {
		return nil, fmt.Errorf("failed to load KeyRecovery: %w", err)
	}

	return &BlockchainService{
		client: client,
		auth:   auth,
		contracts: &ContractRegistry{
			ConsentManager:    consentManager,
			NeuroDataRegistry: neuroDataRegistry,
			KeyRecovery:       keyRecovery,
		},
		contractAddresses: contractAddrs,
	}, nil
}

func (s *BlockchainService) GrantConsent(ctx context.Context, req ConsentRequest) (string, error) {
	tx, err := s.contracts.ConsentManager.GrantConsent(
		&bind.TransactOpts{
			From:   s.auth.From,
			Signer: s.auth.Signer,
			Value:  big.NewInt(0),
		},
		req.Researcher,
		req.DataCID,
		req.Purpose,
		req.DurationDays,
		req.Signature,
	)
	if err != nil {
		return "", fmt.Errorf("failed to grant consent: %w", err)
	}

	receipt, err := bind.WaitMined(ctx, s.client, tx)
	if err != nil {
		return "", fmt.Errorf("transaction failed: %w", err)
	}

	return tx.Hash().Hex(), nil
}

func (s *BlockchainService) VerifyConsent(ctx context.Context, user common.Address, researcher common.Address, dataCID string) (bool, error) {
	return s.contracts.ConsentManager.VerifyConsent(nil, user, researcher, dataCID)
}

func (s *BlockchainService) RevokeConsent(ctx context.Context, consentId [32]byte) (string, error) {
	tx, err := s.contracts.ConsentManager.RevokeConsent(
		&bind.TransactOpts{
			From:   s.auth.From,
			Signer: s.auth.Signer,
		},
		consentId,
	)
	if err != nil {
		return "", fmt.Errorf("failed to revoke consent: %w", err)
	}

	receipt, err := bind.WaitMined(ctx, s.client, tx)
	if err != nil {
		return "", fmt.Errorf("transaction failed: %w", err)
	}

	return tx.Hash().Hex(), nil
}

func (s *BlockchainService) RegisterData(ctx context.Context, reg DataRegistration) (string, error) {
	tx, err := s.contracts.NeuroDataRegistry.RegisterData(
		&bind.TransactOpts{
			From:   s.auth.From,
			Signer: s.auth.Signer,
			Value:  big.NewInt(0),
		},
		reg.IPFSCID,
		reg.DataHash,
		reg.Size,
		reg.IsEncrypted,
		reg.EncryptionAlgorithm,
		reg.Metadata,
	)
	if err != nil {
		return "", fmt.Errorf("failed to register data: %w", err)
	}

	receipt, err := bind.WaitMined(ctx, s.client, tx)
	if err != nil {
		return "", fmt.Errorf("transaction failed: %w", err)
	}

	return tx.Hash().Hex(), nil
}

func (s *BlockchainService) VerifyDataIntegrity(ctx context.Context, ipfsCID string, dataHash [32]byte) (bool, error) {
	return s.contracts.NeuroDataRegistry.VerifyDataIntegrity(nil, ipfsCID, dataHash)
}

func (s *BlockchainService) AddGuardian(ctx context.Context, guardian common.Address) (string, error) {
	tx, err := s.contracts.KeyRecovery.AddGuardian(
		&bind.TransactOpts{
			From:   s.auth.From,
			Signer: s.auth.Signer,
		},
		guardian,
	)
	if err != nil {
		return "", fmt.Errorf("failed to add guardian: %w", err)
	}

	receipt, err := bind.WaitMined(ctx, s.client, tx)
	if err != nil {
		return "", fmt.Errorf("transaction failed: %w", err)
	}

	return tx.Hash().Hex(), nil
}

func (s *BlockchainService) InitiateRecovery(ctx context.Context, newKeyHash [32]byte) (string, error) {
	tx, err := s.contracts.KeyRecovery.InitiateRecovery(
		&bind.TransactOpts{
			From:   s.auth.From,
			Signer: s.auth.Signer,
		},
		newKeyHash,
	)
	if err != nil {
		return "", fmt.Errorf("failed to initiate recovery: %w", err)
	}

	receipt, err := bind.WaitMined(ctx, s.client, tx)
	if err != nil {
		return "", fmt.Errorf("transaction failed: %w", err)
	}

	return tx.Hash().Hex(), nil
}

func (s *BlockchainService) ApproveRecovery(ctx context.Context, requestId [32]byte, shareHash [32]byte) (string, error) {
	tx, err := s.contracts.KeyRecovery.ApproveRecovery(
		&bind.TransactOpts{
			From:   s.auth.From,
			Signer: s.auth.Signer,
		},
		requestId,
		shareHash,
	)
	if err != nil {
		return "", fmt.Errorf("failed to approve recovery: %w", err)
	}

	receipt, err := bind.WaitMined(ctx, s.client, tx)
	if err != nil {
		return "", fmt.Errorf("transaction failed: %w", err)
	}

	return tx.Hash().Hex(), nil
}

func (s *BlockchainService) GetGasPrice(ctx context.Context) (*big.Int, error) {
	return s.client.SuggestGasPrice(ctx)
}

func main() {
	ctx := context.Background()

	rpcURL := os.Getenv("POLYGON_RPC")
	if rpcURL == "" {
		rpcURL = "https://rpc-amoy.polygon.technology"
	}

	privateKey := os.Getenv("PRIVATE_KEY")
	if privateKey == "" {
		log.Fatal("PRIVATE_KEY not set")
	}

	contractAddresses := ContractAddresses{
		ConsentManager:    common.HexToAddress(os.Getenv("CONSENT_MANAGER_ADDR")),
		NeuroDataRegistry: common.HexToAddress(os.Getenv("NEURO_REGISTRY_ADDR")),
		KeyRecovery:       common.HexToAddress(os.Getenv("KEY_RECOVERY_ADDR")),
	}

	service, err := NewBlockchainService(rpcURL, privateKey, contractAddresses)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Blockchain service initialized")
	log.Println("Contract addresses:", service.contractAddresses)

	// Example: Grant consent
	// researcherAddr := common.HexToAddress("0x...")
	// txHash, err := service.GrantConsent(ctx, ConsentRequest{
	// 	Researcher:     researcherAddr,
	// 	DataCID:        "Qm...",
	// 	Purpose:        0,
	// 	DurationDays:   30,
	// 	Signature:      []byte{},
	// })
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// log.Println("Consent granted:", txHash)

	_ = time.Now()
}
