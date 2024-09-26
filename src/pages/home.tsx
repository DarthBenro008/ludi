import { useNotification } from "@/hooks/useNotification";
import { contractId } from "@/lib";
import { LudiContract } from "@/sway-api";
import { useWallet } from "@fuels/react";
import { useEffect, useState } from "react";

"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Button } from "@/components/ui/button";

function ChartComponent({ stakePoolValue, gamblePoolValue }: { stakePoolValue: number, gamblePoolValue: number }) {
    return (
        <Card className="max-w-xs">
            <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>
                    You're average more steps a day this year than last year.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid auto-rows-min gap-2">
                    <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                        {stakePoolValue}
                        <span className="text-sm font-normal text-muted-foreground">
                            Stake Pool Value
                        </span>
                    </div>
                    <ChartContainer
                        config={{
                            steps: {
                                label: "Steps",
                                color: "hsl(var(--chart-1))",
                            },
                        }}
                        className="aspect-auto h-[32px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            layout="vertical"
                            margin={{
                                left: 0,
                                top: 0,
                                right: 0,
                                bottom: 0,
                            }}
                            data={[
                                {
                                    date: stakePoolValue,
                                    steps: stakePoolValue,
                                },
                            ]}
                        >
                            <Bar
                                dataKey="steps"
                                fill="var(--color-steps)"
                                radius={4}
                                barSize={32}
                            >
                                <LabelList
                                    position="insideLeft"
                                    dataKey="date"
                                    offset={8}
                                    fontSize={12}
                                    fill="white"
                                />
                            </Bar>
                            <YAxis dataKey="date" type="category" tickCount={1} hide />
                            <XAxis dataKey="steps" type="number" hide />
                        </BarChart>
                    </ChartContainer>
                </div>
                <div className="grid auto-rows-min gap-2">
                    <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                        {gamblePoolValue}
                        <span className="text-sm font-normal text-muted-foreground">
                            Gamble Pool Value
                        </span>
                    </div>
                    <ChartContainer
                        config={{
                            steps: {
                                label: "Steps",
                                color: "hsl(var(--muted))",
                            },
                        }}
                        className="aspect-auto h-[32px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            layout="vertical"
                            margin={{
                                left: 0,
                                top: 0,
                                right: 0,
                                bottom: 0,
                            }}
                            data={[
                                {
                                    date: gamblePoolValue,
                                    steps: gamblePoolValue,
                                },
                            ]}
                        >
                            <Bar
                                dataKey="steps"
                                fill="var(--color-steps)"
                                radius={4}
                                barSize={32}
                            >
                                <LabelList
                                    position="insideLeft"
                                    dataKey="date"
                                    offset={8}
                                    fontSize={12}
                                    fill="hsl(var(--muted-foreground))"
                                />
                            </Bar>
                            <YAxis dataKey="date" type="category" tickCount={1} hide />
                            <XAxis dataKey="steps" type="number" hide />
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}

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
            <ChartComponent stakePoolValue={stakePoolValue ?? 0} gamblePoolValue={gamblePoolValue ?? 0} />
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


export default function Home() {
    return (
        <div>
            Home
            <div>
                <ReadPools />
            </div>
        </div>
    )
}