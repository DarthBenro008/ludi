import { useConnectUI, useIsConnected, useNetwork } from "@fuels/react";
import { useEffect } from "react";

import { useRouter } from "./hooks/useRouter";
import Wallet from "./components/Wallet";
import { providerUrl } from "./lib.tsx";
import { Button } from "./components/ui/button.tsx";

function App() {
  const { connect } = useConnectUI();
  const { isConnected, refetch } = useIsConnected();
  const { network } = useNetwork();
  const { view, views, setRoute } = useRouter();
  const isConnectedToCorrectNetwork = network?.url === providerUrl;

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <main
      data-theme="dark"
    >
      <div className="">
        {!isConnected && (
          <section className="flex h-full flex-col justify-center space-y-6 px-4 py-8 lg:px-[25%]">
            <Button onClick={() => connect()}>Connect Wallet</Button>
          </section>
        )}

        {isConnected && !isConnectedToCorrectNetwork && (
          <section className="flex h-full flex-col justify-center space-y-6 px-4 py-8">
            <p className="text-center">
              You are connected to the wrong network. Please switch to{" "}
              <a
                href={providerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-green-500/80 transition-colors hover:text-green-500"
              >
                {providerUrl}
              </a>
              &nbsp;in your wallet.
            </p>
          </section>
        )}

        {isConnected && isConnectedToCorrectNetwork && (
          <section className="flex h-full flex-col justify-center space-y-6 px-4 py-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <Wallet />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
