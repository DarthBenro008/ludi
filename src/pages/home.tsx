import { useNotification } from "@/hooks/useNotification";
import { contractId } from "@/lib";
import { LudiContract } from "@/sway-api";
import { useConnectUI, useIsConnected, useNetwork, useWallet } from "@fuels/react";
import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import Stake from "@/components/stake";
import Gamble from "@/components/gamble";

function ConnectWallet() {
    const { connect } = useConnectUI();
    const { isConnected, refetch } = useIsConnected();

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to Ludi Finance</CardTitle>
                    <CardDescription>Connect your wallet to get started</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4">
                    <Button onClick={() => connect()}>Connect Wallet</Button>
                </CardContent>
            </Card>
        </div>
    )
}


export default function Home() {
    const { wallet, refetch: walletRefetch } = useWallet();
    const { isConnected, refetch } = useIsConnected();
    const { network } = useNetwork();
    const [balance, setBalance] = useState(0);
    

    useEffect(() => {
        console.log(contractId);
        console.log(network);
    }, []);

    useEffect(() => {
        refetch();
        walletRefetch();
    }, [refetch, walletRefetch]);

    const updateBalance = () => {
        setBalance(balance + 0.00001);
    }
    return (
        <div className="h-screen flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center h-24">
                <p className="text-5xl font-['Cedarville_Cursive']">ludi finance.</p>
            </div>
            {isConnected ?
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col border-border border-r">
                        <Stake balance={balance} />
                    </div>
                    <div className="flex flex-col">
                        <Gamble updateBalance={updateBalance} />
                    </div>
                </div>
                : <ConnectWallet />}
        </div>
    )
}