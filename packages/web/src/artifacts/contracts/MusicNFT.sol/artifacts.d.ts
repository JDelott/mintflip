// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { MusicNFT$Type } from "./MusicNFT";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["MusicNFT"]: MusicNFT$Type;
    ["contracts/MusicNFT.sol:MusicNFT"]: MusicNFT$Type;
  }

  interface ContractTypesMap {
    ["MusicNFT"]: GetContractReturnType<MusicNFT$Type["abi"]>;
    ["contracts/MusicNFT.sol:MusicNFT"]: GetContractReturnType<MusicNFT$Type["abi"]>;
  }
}
