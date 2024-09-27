import { useNotification } from "@/hooks/useNotification";
import { contractId } from "@/lib";
import { LudiContract } from "@/sway-api";
import { useConnectUI, useIsConnected, useWallet } from "@fuels/react";
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


function ReadPools() {
    const {
        errorNotification,
        transactionSubmitNotification,
        transactionSuccessNotification,
    } = useNotification();
    const [contract, setContract] = useState<LudiContract>();
    const [stakePoolValue, setStakePoolValue] = useState<number>();
    const [gamblePoolValue, setGamblePoolValue] = useState<number>();
    const [isLoading, setIsLoading] = useState(false);
    const { wallet, refetch } = useWallet();

    useEffect(() => {
        if (wallet) {
            const testContract = new LudiContract(contractId, wallet);
            setContract(testContract);
        }
    }, [wallet]);

    useEffect(() => {
        if (contract && !stakePoolValue) {
            const getStakePoolValue = async () => {
                const { value } = await contract.functions.get_stake_pool().get();
                console.log(value.toNumber());
                setStakePoolValue(value.toNumber());
            };

            const getGamblePoolValue = async () => {
                const { value } = await contract.functions.get_gamble_pool().get();
                console.log(value);
                setGamblePoolValue(value.toNumber());
            };

            getStakePoolValue();
            getGamblePoolValue();
        }
    }, [contract, stakePoolValue, gamblePoolValue]);

    if (!wallet) {
        return <div>Connect your wallet to view the pools</div>
    }

    return (
        <div>
            <Button onClick={async () => {
                console.log("clicked");
                try {
                    const asset = contract?.provider.getBaseAssetId();
                    const call = await contract!!.functions.deposit().callParams({
                        forward: [100000000, asset as string],
                    }).call();
                    transactionSubmitNotification(call.transactionId);
                    const result = await call.waitForResult();
                    transactionSuccessNotification(result.transactionId);
                    console.log("amount", result.logs[0].amount.toNumber())
                    console.log(result.logs)
                    console.log(result.value)
                } catch (e) {
                    console.log(e);
                }
            }}>Click Me</Button>
            <Button onClick={async () => {
                console.log("clicked");
                try {
                    const call = await contract!!.functions.withdraw("50000000").call();
                    transactionSubmitNotification(call.transactionId);
                    const result = await call.waitForResult();
                    transactionSuccessNotification(result.transactionId);
                    console.log(result.value)
                } catch (e) {
                    console.log(e);
                }
            }}>Withdraw</Button>
        </div>
    )
}


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

    useEffect(() => {
        refetch();
        walletRefetch();
    }, [refetch, walletRefetch]);
    return (
        <div className="h-screen flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center h-24">
                <p className="text-5xl font-['Cedarville_Cursive']">ludi finance.</p>
            </div>
            {isConnected ?
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col border-border border-r">
                        <Stake />
                    </div>
                    <div className="flex flex-col">
                        <Gamble />
                    </div>
                </div>
                : <ConnectWallet />}
        </div>
    )
}