cmake_minimum_required(VERSION 3.20)
project(neuro_crypto LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_POSITION_INDEPENDENT_CODE ON)

find_package(OpenSSL REQUIRED)
find_package(Threads REQUIRED)

option(ENABLE_OPENMP "Enable OpenMP parallelization" ON)
if(ENABLE_OPENMP)
    find_package(OpenMP REQUIRED)
endif()

add_library(neuro_crypto SHARED
    src/neuro_crypto.cpp
    src/aes_gcm.cpp
    src/signal_processor.cpp
    src/fhe_ops.cpp
)

target_include_directories(neuro_crypto PUBLIC 
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:include>
)

target_link_libraries(neuro_crypto 
    PUBLIC OpenSSL::SSL
    PUBLIC OpenSSL::Crypto
)

if(ENABLE_OPENMP)
    target_link_libraries(neuro_crypto PUBLIC OpenMP::OpenMP_CXX)
    target_compile_options(neuro_crypto PRIVATE -fopenmp)
endif()

target_compile_options(neuro_crypto PRIVATE 
    -O2
    -Wall
    -Wextra
)

find_package(pybind11 QUIET)
if(pybind11_FOUND)
    pybind11_add_module(_neuro_crypto python/pybind_binding.cpp)
    target_link_libraries(_neuro_crypto PRIVATE neuro_crypto)
    install(TARGETS _neuro_crypto DESTINATION ${Python_SITE_PACKAGES})
endif()

find_package(Python3 QUIET)
if(Python3_FOUND)
    add_subdirectory(python)
endif()

install(TARGETS neuro_crypto LIBRARY DESTINATION lib)
install(DIRECTORY include/ DESTINATION include)
