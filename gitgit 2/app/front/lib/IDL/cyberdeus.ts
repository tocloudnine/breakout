export type Cyberdeus = {
  "version": "0.1.0",
  "name": "cyberdeus",
  "instructions": [
    {
      "name": "initializeDeus",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "deusConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "feePercentage",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createCollection",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "deusConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Metaplex Metadata PDA"
          ]
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Master Edition PDA"
          ]
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Metaplex Token Metadata program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "maxSupply",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createNft",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "deusConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Collection mint"
          ]
        },
        {
          "name": "collectionMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Collection metadata"
          ]
        },
        {
          "name": "collectionMasterEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Collection master edition"
          ]
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Metadata for NFT"
          ]
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Master Edition for NFT"
          ]
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Metaplex Token Metadata program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "createEscrow",
      "accounts": [
        {
          "name": "seller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "deusConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of the NFT"
          ]
        },
        {
          "name": "sellerNftToken",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token account holding the NFT"
          ]
        },
        {
          "name": "escrowTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The escrow token account that will hold the NFT"
          ]
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The metadata account of the NFT"
          ]
        },
        {
          "name": "nftMasterEdition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The master edition account of the NFT"
          ]
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL Associated Token program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "edition",
          "type": "u16"
        },
        {
          "name": "physicalMerchandisingPercentage",
          "type": "u64"
        },
        {
          "name": "digitalResellPercentage",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyNft",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "seller",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deusConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Treasury account to receive fees"
          ]
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The escrow token account holding the NFT"
          ]
        },
        {
          "name": "buyerNftToken",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The buyer's token account to receive the NFT"
          ]
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The metadata account of the NFT"
          ]
        },
        {
          "name": "nftMasterEdition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The master edition account of the NFT"
          ]
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL Associated Token program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buyMerch",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "seller",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deusConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "artist",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program"
          ]
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "deusConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "treasury",
            "type": "publicKey"
          },
          {
            "name": "feePercentage",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                20
              ]
            }
          }
        ]
      }
    },
    {
      "name": "escrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "seller",
            "type": "publicKey"
          },
          {
            "name": "artist",
            "type": "publicKey"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "name",
            "docs": [
              "Name string, max 32 bytes"
            ],
            "type": "string"
          },
          {
            "name": "edition",
            "type": "u16"
          },
          {
            "name": "physicalMerchandisingPercentage",
            "type": "u64"
          },
          {
            "name": "digitalResellPercentage",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AlreadyInitialized",
      "msg": "Already initialized"
    },
    {
      "code": 6001,
      "name": "InvalidAdmin",
      "msg": "Invalid admin"
    },
    {
      "code": 6002,
      "name": "InvalidTokenMint",
      "msg": "Invalid token mint"
    },
    {
      "code": 6003,
      "name": "InvalidTokenOwner",
      "msg": "Invalid token owner"
    },
    {
      "code": 6004,
      "name": "InvalidTokenAmount",
      "msg": "Invalid token amount"
    },
    {
      "code": 6005,
      "name": "InvalidTreasury",
      "msg": "Invalid treasury"
    },
    {
      "code": 6006,
      "name": "InvalidFeePercentage",
      "msg": "Invalid fee percentage"
    },
    {
      "code": 6007,
      "name": "EscrowNotActive",
      "msg": "Escrow not active"
    },
    {
      "code": 6008,
      "name": "InvalidSeller",
      "msg": "Invalid seller"
    },
    {
      "code": 6009,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds"
    }
  ]
};

export const IDL: Cyberdeus = {
  "version": "0.1.0",
  "name": "cyberdeus",
  "instructions": [
    {
      "name": "initializeDeus",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "deusConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "feePercentage",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createCollection",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "deusConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Metaplex Metadata PDA"
          ]
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Master Edition PDA"
          ]
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Metaplex Token Metadata program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "maxSupply",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createNft",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "deusConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Collection mint"
          ]
        },
        {
          "name": "collectionMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Collection metadata"
          ]
        },
        {
          "name": "collectionMasterEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Collection master edition"
          ]
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Metadata for NFT"
          ]
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Master Edition for NFT"
          ]
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Metaplex Token Metadata program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "createEscrow",
      "accounts": [
        {
          "name": "seller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "deusConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of the NFT"
          ]
        },
        {
          "name": "sellerNftToken",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token account holding the NFT"
          ]
        },
        {
          "name": "escrowTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The escrow token account that will hold the NFT"
          ]
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The metadata account of the NFT"
          ]
        },
        {
          "name": "nftMasterEdition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The master edition account of the NFT"
          ]
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL Associated Token program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "edition",
          "type": "u16"
        },
        {
          "name": "physicalMerchandisingPercentage",
          "type": "u64"
        },
        {
          "name": "digitalResellPercentage",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyNft",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "seller",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deusConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Treasury account to receive fees"
          ]
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The escrow token account holding the NFT"
          ]
        },
        {
          "name": "buyerNftToken",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The buyer's token account to receive the NFT"
          ]
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The metadata account of the NFT"
          ]
        },
        {
          "name": "nftMasterEdition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The master edition account of the NFT"
          ]
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL Associated Token program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buyMerch",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "seller",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deusConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "artist",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program"
          ]
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "deusConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "treasury",
            "type": "publicKey"
          },
          {
            "name": "feePercentage",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                20
              ]
            }
          }
        ]
      }
    },
    {
      "name": "escrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "seller",
            "type": "publicKey"
          },
          {
            "name": "artist",
            "type": "publicKey"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "name",
            "docs": [
              "Name string, max 32 bytes"
            ],
            "type": "string"
          },
          {
            "name": "edition",
            "type": "u16"
          },
          {
            "name": "physicalMerchandisingPercentage",
            "type": "u64"
          },
          {
            "name": "digitalResellPercentage",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AlreadyInitialized",
      "msg": "Already initialized"
    },
    {
      "code": 6001,
      "name": "InvalidAdmin",
      "msg": "Invalid admin"
    },
    {
      "code": 6002,
      "name": "InvalidTokenMint",
      "msg": "Invalid token mint"
    },
    {
      "code": 6003,
      "name": "InvalidTokenOwner",
      "msg": "Invalid token owner"
    },
    {
      "code": 6004,
      "name": "InvalidTokenAmount",
      "msg": "Invalid token amount"
    },
    {
      "code": 6005,
      "name": "InvalidTreasury",
      "msg": "Invalid treasury"
    },
    {
      "code": 6006,
      "name": "InvalidFeePercentage",
      "msg": "Invalid fee percentage"
    },
    {
      "code": 6007,
      "name": "EscrowNotActive",
      "msg": "Escrow not active"
    },
    {
      "code": 6008,
      "name": "InvalidSeller",
      "msg": "Invalid seller"
    },
    {
      "code": 6009,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds"
    }
  ]
};
