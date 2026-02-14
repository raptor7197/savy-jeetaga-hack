#pragma once

#include <cstdint>
#include <vector>
#include <string>
#include <memory>

namespace neuro {

struct EncryptedPacket {
    std::vector<uint8_t> ciphertext;
    std::vector<uint8_t> nonce;
    std::vector<uint8_t> tag;
    std::vector<uint8_t> encrypted_key;
};

struct FHEContext {
    void* tfhe_context;
    std::vector<uint8_t> public_key;
    std::vector<uint8_t> private_key;
};

struct EEGSignal {
    std::vector<float> channels;
    uint32_t sample_rate;
    uint64_t timestamp;
};

struct WaveletResult {
    std::vector<std::vector<float>> magnitudes;
    std::vector<float> frequencies;
    std::vector<float> times;
};

class NeuroCrypto {
private:
    static constexpr size_t AES_KEY_SIZE = 32;
    static constexpr size_t NONCE_SIZE = 12;
    
    std::vector<uint8_t> master_key;
    std::unique_ptr<FHEContext> fhe_ctx;
    bool fhe_initialized;
    
public:
    NeuroCrypto();
    ~NeuroCrypto();
    
    // Layer 1: AES-256-GCM Encryption (CPU-optimized)
    EncryptedPacket encrypt_aes(const uint8_t* data, size_t len);
    std::vector<uint8_t> decrypt_aes(const EncryptedPacket& packet);
    
    // Layer 1: Homomorphic Encryption Setup (CPU-based)
    void initialize_fhe(uint32_t security_level = 128);
    std::vector<uint8_t> encrypt_fhe(const int32_t* data, size_t count);
    std::vector<int32_t> decrypt_fhe(const std::vector<uint8_t>& ciphertext);
    
    // FHE Computation (CPU-optimized)
    std::vector<uint8_t> compute_fhe_sum(const std::vector<uint8_t>& a, 
                                          const std::vector<uint8_t>& b);
    std::vector<uint8_t> compute_fhe_mean(const std::vector<uint8_t>& data);
    bool is_fhe_initialized() const { return fhe_initialized; }
    
    // Signal Processing (CPU-based fCWT)
    WaveletResult compute_fcwt(const EEGSignal& signal);
    bool detect_anomaly(const EEGSignal& signal);
    std::vector<float> apply_bandpass_filter(const std::vector<float>& input,
                                              float low_freq, float high_freq);
    
    // Key Management
    std::vector<uint8_t> export_public_key();
    void import_key(const std::vector<uint8_t>& key);
    std::vector<uint8_t> get_master_key_hash() const;
};

} // namespace neuro
