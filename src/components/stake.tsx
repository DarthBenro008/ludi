
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { RocketIcon } from "@radix-ui/react-icons"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label as LabelUI } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useNotification } from "@/hooks/useNotification";
import { contractId } from "@/lib";
import { LudiContract } from "@/sway-api";
import { useWallet } from "@fuels/react"

export const description = "A stacked area chart"

function StakeCard({ investment, fetchData }: { investment: number, fetchData: () => Promise<void> }) {
    return (
        <Card className="sm:col-span-2 w-[550px]">
            <CardContent className="grid grid-cols-2 p-4">
                <div className="flex flex-col gap-3 justify-center">
                    <CardTitle>Your Current Stake</CardTitle>
                    <CardDescription className="text-balance max-w-lg leading-relaxed">
                        You earn a minimum of 5% APR.
                    </CardDescription>
                    <StakeDialog fetchData={fetchData} />
                </div>
                <div className="flex flex-row w-full items-center gap-2 justify-center">
                    <p className="text-4xl font-mono">{investment}</p>
                    <p>ETH</p>
                </div>
            </CardContent>
        </Card>
    )
}





const chartConfigDistribution = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function StakeDistribution({ stakePoolInvestment, gamblePoolInvestment }: { stakePoolInvestment: number, gamblePoolInvestment: number }) {
    const totalStake = stakePoolInvestment + gamblePoolInvestment

    const chartDataDistribution = [{ month: "january", stake_pool: stakePoolInvestment, gamble_pool: gamblePoolInvestment }]

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Your Stake Distribution</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
                <ChartContainer
                    config={chartConfigDistribution}
                    className="mx-auto aspect-square w-full max-w-[250px]"
                >
                    <RadialBarChart
                        data={chartDataDistribution}
                        endAngle={180}
                        innerRadius={80}
                        outerRadius={130}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 16}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {totalStake.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 4}
                                                    className="fill-muted-foreground"
                                                >
                                                    ETH
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="stake_pool"
                            stackId="a"
                            cornerRadius={5}
                            fill="var(--color-desktop)"
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="gamble_pool"
                            fill="var(--color-mobile)"
                            stackId="a"
                            cornerRadius={5}
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Investment trending up by 6% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total stake for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}





const chartData = [
    { month: "January", gamble_pool: 186, stake_pool: 80 },
    { month: "February", gamble_pool: 305, stake_pool: 200 },
    { month: "March", gamble_pool: 237, stake_pool: 120 },
    { month: "April", gamble_pool: 73, stake_pool: 190 },
    { month: "May", gamble_pool: 209, stake_pool: 130 },
    { month: "June", gamble_pool: 214, stake_pool: 140 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function PortfolioCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Portfolio Gains</CardTitle>
                <CardDescription>
                    Showing total visitors for the last 6 months
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            dataKey="stake_pool"
                            type="natural"
                            fill="var(--color-mobile)"
                            fillOpacity={0.4}
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />
                        <Area
                            dataKey="gamble_pool"
                            type="natural"
                            fill="var(--color-desktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            January - June 2024
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export function StakeDialog({ fetchData }: { fetchData: () => Promise<void> }) {
    const {
        errorNotification,
        transactionSubmitNotification,
        transactionSuccessNotification,
    } = useNotification();
    const [stakeAmount, setStakeAmount] = useState(0);
    const { wallet } = useWallet();
    const [contract, setContract] = useState<LudiContract>();
    useEffect(() => {
        if (wallet) {
            setContract(new LudiContract(contractId, wallet));
        }
    }, [wallet]);
    const [open, setOpen] = useState(false);

    const handleStake = async () => {
        try {
            const asset = contract?.provider.getBaseAssetId();
            const call = await contract!!.functions.deposit().callParams({
                forward: [stakeAmount * 1000000000, asset as string],
            }).call();
            transactionSubmitNotification(call.transactionId);
            const result = await call.waitForResult();
            transactionSuccessNotification(result.transactionId);
            console.log("amount", result.logs[0].amount.toNumber())
            console.log(result.logs)
            console.log(result.value)
            fetchData();
            setOpen(false);
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Stake More</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stake More</DialogTitle>
                    <DialogDescription>
                        Stake more ETH to earn rewards. You earn a minimum of 5% APR.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <LabelUI htmlFor="name" className="text-right">
                            ETH Amount
                        </LabelUI>
                        <Input id="name" type="number" value={stakeAmount} onChange={(e) => setStakeAmount(Number(e.target.value))} className="col-span-3" />
                    </div>
                    <Alert>
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            Your stake will be split 50-50 between stake and gamble pools.
                        </AlertDescription>
                    </Alert>
                </div>
                <DialogFooter>
                    <Button className="w-full" type="submit" onClick={handleStake}>Stake</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function WithdrawDialog({ fetchData }: { fetchData: () => Promise<void> }) {
    const {
        errorNotification,
        transactionSubmitNotification,
        transactionSuccessNotification,
    } = useNotification();
    const [stakeAmount, setStakeAmount] = useState(0);
    const { wallet } = useWallet();
    const [contract, setContract] = useState<LudiContract>();
    useEffect(() => {
        if (wallet) {
            setContract(new LudiContract(contractId, wallet));
        }
    }, [wallet]);
    const [open, setOpen] = useState(false);
    const handleWithdraw = async () => {
        try {
            const call = await contract!!.functions.withdraw(stakeAmount * 1000000000).call();
            transactionSubmitNotification(call.transactionId);
            const result = await call.waitForResult();
            transactionSuccessNotification(result.transactionId);
            console.log(result.value)
            fetchData();
            setOpen(false);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"destructive"}>Withdraw</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Withdraw</DialogTitle>
                    <DialogDescription>
                        Withdraw your ETH.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <LabelUI htmlFor="name" className="text-right">
                            ETH Amount
                        </LabelUI>
                        <Input id="name" type="number" value={stakeAmount} onChange={(e) => setStakeAmount(Number(e.target.value))} className="col-span-3" />
                    </div>
                    <Alert>
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            Your stake will be withdrawn from the stake pool.
                        </AlertDescription>
                    </Alert>
                </div>
                <DialogFooter>
                    <Button variant={"destructive"} className="w-full" type="submit" onClick={handleWithdraw}>Withdraw</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function Stake({balance}: {balance: number}) {
    const { wallet } = useWallet();
    const [contract, setContract] = useState<LudiContract>();
    useEffect(() => {
        if (wallet) {
            setContract(new LudiContract(contractId, wallet));
        }
    }, [wallet]);
    const [investment, setInvestment] = useState(0);
    const [stakePoolInvestment, setStakePoolInvestment] = useState(0);
    const [gamblePoolInvestment, setGamblePoolInvestment] = useState(0);

    useEffect(() => {
        fetchData();
    }, [contract, stakePoolInvestment, gamblePoolInvestment]);


    const fetchData = async () => {
        setInvestment(stakePoolInvestment + gamblePoolInvestment + balance);
        if (contract) {
            const getStakePoolValue = async () => {
                const { value } = await contract.functions.get_stake_pool().get();
                setStakePoolInvestment(value.toNumber() / 1000000000);
            };

            const getGamblePoolValue = async () => {
                const { value } = await contract.functions.get_gamble_pool().get();
                setGamblePoolInvestment(value.toNumber() / 1000000000);
            };

            getStakePoolValue();
            getGamblePoolValue();
        }
    }

    const fetcher = async () => {
        setTimeout(() => {
            fetchData();
        }, 500);
    }


    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col w-full items-center justify-center">
                <p className="text-4xl font-mono">Stake</p>
            </div>
            <div className="flex flex-col w-full justify-center pl-4">
                <p className="text-2xl font-mono">Your Investments</p>
            </div>
            <div className="flex flex-col pt-4 gap-4 w-full items-center justify-center">
                <StakeCard fetchData={fetcher} investment={investment} />
            </div>
            <div className="flex flex-col gap-4 w-full justify-center pl-4 pt-4">
                <p className="text-2xl font-mono">Your Portfolio</p>
                <div className="grid grid-cols-2 gap-4">
                    <PortfolioCard />
                    <StakeDistribution stakePoolInvestment={stakePoolInvestment} gamblePoolInvestment={gamblePoolInvestment} />
                </div>
            </div>
            <div className="flex flex-col gap-4 w-full justify-center pl-4 pt-4">
                <WithdrawDialog fetchData={fetcher} />
            </div>
        </div>
    )
}