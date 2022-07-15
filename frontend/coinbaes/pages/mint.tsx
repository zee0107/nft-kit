import { NextPage } from "next";
import styles from "@styles/Mint.module.css";
import { Button, Link, VStack } from "@chakra-ui/react";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import NonFungibleCoinbae from "@data/NonFungibleCoinbae.json";
import { useState } from "react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
} from "@chakra-ui/react";
import Image from "next/image";
import web3 from "web3";
import { abridgeAddress } from "@utils/abridgeAddress";
import ConnectWallet from "@components/web3/ConnectWallet";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const BLOCK_EXPLORER = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL;
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

const PRICE = 0.06;
const Mint: NextPage = () => {
  const { data: account } = useAccount();
  const { activeChain, switchNetwork } = useNetwork();

  const [payable, setPayable] = useState(BigInt(60000000000000000).toString());
  const [numPublicMint, setNumPublicMint] = useState(3);
  const [hasMinted, setHasMinted] = useState(false);

  const handleChange = (value: number | string) => {
    setNumPublicMint(Number(value));
    const payableInEth = PRICE * Number(value);
    const payableinWei = web3.utils.toWei(payableInEth.toString(10), "ether");
    setPayable(payableinWei);
  };

  const {
    data: publicSaleData,
    error: publicSaleError,
    isError: publicSaleIsError,
    isLoading: publicSaleIsLoading,
    write: publicSaleWrite,
  } = useContractWrite(
    {
      addressOrName: CONTRACT_ADDRESS
        ? CONTRACT_ADDRESS
        : "0xCa4E3b3f98cCA9e801f88F13d1BfE68176a03dFA",
      contractInterface: NonFungibleCoinbae.abi,
    },
    "mintPublicSale",
    {
      overrides: {
        value: payable,
      },
      args: [numPublicMint],
      onError(error) {
        console.log(error);
      },
      onSuccess(data) {
        console.log(data);
        setHasMinted(true);
      },
    }
  );

  const handlePublicMint = async () => {
    try {
      await publicSaleWrite();
    } catch (err) {
      console.log(`Error minting ${err}`);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Non-fungible Polybaes
          </h1>
          {hasMinted && publicSaleData ? (
            <VStack>
              <Image
                alt="placeholder image for team members"
                src={"/assets/success.png"}
                width={250}
                height={250}
              />
              <p style={{ color: "white" }}>
                Your transaction was sent! Click here to view your transaction:
              </p>
              <Link
                href={`${BLOCK_EXPLORER || "https://rinkeby.etherscan.io"}/tx/${
                  publicSaleData.hash
                }`}
                target="_blank"
                rel="noreferrer"
                style={{
                  /*fontFamily: "'Press Start 2P', cursive",*/
                  color: "white",
                  borderRadius: "0",
                }}
              >
                Etherscan: {abridgeAddress(publicSaleData.hash)}
              </Link>
              <Link href="/myPolybaes">
                <Button
                  style={{
                    /*fontFamily: "'Press Start 2P', cursive",*/
                    color: "#ffffff",
                    backgroundColor: "#e31b25",
                    borderRadius: 20,
                  }}
                >
                  View My Coinbae Collection
                </Button>
              </Link>
            </VStack>
          ) : !account?.address ? (
            <VStack>
              <Image
                alt="placeholder image for team members"
                src={"/assets/cb.png"}
                width={250}
                height={250}
              />
              <p style={{ color: "white" }}>Connect wallet to mint!</p>
              <ConnectWallet />
            </VStack>
          ) : activeChain?.id !== CHAIN_ID ? (
            <VStack>
              <Image
                alt="placeholder image for team members"
                src={"/assets/cb.png"}
                width={250}
                height={250}
              />
              <p style={{ color: "white" }}>You're on the wrong Network!</p>
              <Button
                style={{
                  /*fontFamily: "'Press Start 2P', cursive",*/
                  color: "#ffffff",
                  backgroundColor: "#e31b25",
                  borderRadius: 20,
                }}
                onClick={() => {
                  switchNetwork && switchNetwork(CHAIN_ID);
                }}
              >
                Switch Network
              </Button>
            </VStack>
          ) : (
            <VStack>
              <Image
                alt="placeholder image for team members"
                src={"/assets/cbw.png"}
                width={250}
                height={250}
              />
              {/* select # of tokens to mint */}
              <NumberInput
                step={1}
                defaultValue={3}
                min={1}
                max={5}
                precision={0}
                onChange={handleChange}
                inputMode="numeric"
                variant="filled"
              >
                <NumberInputField
                  _focus={{ bg: "white.300" }}
                  _active={{ bg: "white.300" }}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Button
                style={{
                  color: "#ffffff",
                  backgroundColor: "#e31b25",
                  borderRadius: 20,
                }}
                onClick={handlePublicMint}
              >
                Mint public sale
                {publicSaleIsLoading && <Spinner marginLeft={2} />}
              </Button>

              {publicSaleIsError && (
                <p style={{ color: "red" }}>
                  Error:{" "}
                  {publicSaleError?.message.includes("Max tokens to mint") &&
                    "Minted max tokens"}
                  {/* this happens sometimes when there is a race condition on the payable state */}
                  {publicSaleError?.message.includes("Incorrect ETH") &&
                    "Please try again."}
                  {publicSaleError?.message.includes("not open") &&
                    "Public sale is currently closed"}
                  {publicSaleError?.message.includes("insufficient funds") &&
                    "Insufficient funds"}
                  {publicSaleError?.message.includes(
                    "Insufficient tokens remaining"
                  ) && "The collection has fully minted"}
                  {publicSaleError?.message.includes("User rejected request") &&
                    "User rejected request"}
                </p>
              )}
            </VStack>
          )}
        </main>
      </div>
    </div>
  );
};

export default Mint;
