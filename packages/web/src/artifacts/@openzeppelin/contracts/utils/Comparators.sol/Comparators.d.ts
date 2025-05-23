// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface Comparators$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "Comparators",
  "sourceName": "@openzeppelin/contracts/utils/Comparators.sol",
  "abi": [],
  "bytecode": "0x60566050600b82828239805160001a6073146043577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220a24cff8dced09d2aed8655114155a6e8d65e2e79429fb59e97683d8033d86a9664736f6c634300081c0033",
  "deployedBytecode": "0x73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220a24cff8dced09d2aed8655114155a6e8d65e2e79429fb59e97683d8033d86a9664736f6c634300081c0033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "Comparators",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<Comparators$Type["abi"]>>;
  export function deployContract(
    contractName: "@openzeppelin/contracts/utils/Comparators.sol:Comparators",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<Comparators$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "Comparators",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<Comparators$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "@openzeppelin/contracts/utils/Comparators.sol:Comparators",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<Comparators$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "Comparators",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<Comparators$Type["abi"]>>;
  export function getContractAt(
    contractName: "@openzeppelin/contracts/utils/Comparators.sol:Comparators",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<Comparators$Type["abi"]>>;
}
