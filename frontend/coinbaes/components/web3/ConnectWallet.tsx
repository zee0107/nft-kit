import { useAccount, useNetwork, useDisconnect } from "wagmi";
import WalletModal from "@components/web3/WalletModal";
import {
  Button,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { abridgeAddress } from "@utils/abridgeAddress";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import styles from "../../styles/Navbar.module.css";

type ConnectWalletProps = {
  isMobile?: boolean;
  size?: string;
};

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

const ConnectWallet = ({ isMobile, size }: ConnectWalletProps) => {
  const { data } = useAccount();
  const { activeChain, switchNetwork } = useNetwork();
  const {
    isOpen: connectIsOpen,
    onOpen: connectOnOpen,
    onClose: connectOnClose,
  } = useDisclosure();

  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (activeChain?.id !== CHAIN_ID && switchNetwork) switchNetwork(CHAIN_ID);
  }, [activeChain]);

  return (
    <>
      {!isMobile ? (
        <>
          {!data ? (
            <Button
              style={{
                color: "#ffffff",
                backgroundColor: "#e31b25",
                borderRadius: 20,
              }}
              onClick={connectOnOpen}
              size={size}
            >
              Connect Wallet
            </Button>
          ) : activeChain?.id === CHAIN_ID ? (
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    isActive={isOpen}
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    style={{
                      /*fontFamily: "'Press Start 2P', cursive",*/
                      color: "#ffffff",
                      backgroundColor: "#e31b25",
                      borderRadius: 20,
                      overflow: "hidden",
                    }}
                  >
                    Account: {abridgeAddress(data?.address)}
                  </MenuButton>
                  <MenuList
                    color="black"
                    style={{
                      /*fontFamily: "'Press Start 2P', cursive",*/
                      color: "#4b4f56",
                      borderRadius: "0",
                      width: "100%",
                    }}
                  >
                    <MenuItem>
                      <Link
                        href="/mypolybaes"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        View My Polybaes
                      </Link>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        disconnect();
                      }}
                    >
                      Disconnect Wallet
                    </MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          ) : (
            <Button
              style={{
                color: "#ffffff",
                backgroundColor: "#e31b25",
                borderRadius: 20,
              }}
              onClick={() => switchNetwork && switchNetwork(CHAIN_ID)}
            >
              Switch Network
            </Button>
          )}
        </>
      ) : (
        <>
          {!data ? (
            <VStack marginTop="20" spacing="24px" alignItems="flex-start">
              <button className={styles.button} onClick={connectOnOpen}>
                Connect Wallet
              </button>
            </VStack>
          ) : (
            <VStack marginTop="20" spacing="24px" alignItems="flex-start">
              <Link href="/mypolybaes">
                <button className={styles.button}>View My Polybaes</button>
              </Link>
              <Link
                onClick={() => {
                  disconnect();
                }}
              >
                <button className={styles.button}>Disconnect Wallet</button>
              </Link>
            </VStack>
          )}
        </>
      )}
      <WalletModal isOpen={connectIsOpen} closeModal={connectOnClose} />
    </>
  );
};

export default ConnectWallet;
