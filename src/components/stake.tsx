
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

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A stacked area chart"

function StakeCard() {
    return (
        <Card className="sm:col-span-2 w-[550px]">
            <CardContent className="grid grid-cols-2 p-4">
                <div className="flex flex-col gap-3 justify-center">
                    <CardTitle>Your Current Stake</CardTitle>
                    <CardDescription className="text-balance max-w-lg leading-relaxed">
                        Stake your coins to earn rewards.
                    </CardDescription>
                    <Button>Stake More</Button>
                </div>
                <div className="flex flex-row w-full items-center gap-2 justify-center">
                    <p className="text-4xl font-mono">0</p>
                    <p>ETH</p>
                </div>
            </CardContent>
        </Card>
    )
}



const chartDataDistribution = [{ month: "january", stake_pool: 1260, gamble_pool: 570 }]

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

export function StakeDistribution() {
    const totalStake = chartDataDistribution[0].stake_pool + chartDataDistribution[0].gamble_pool

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


export default function Stake() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col w-full items-center justify-center">
                <p className="text-4xl font-mono">Stake</p>
            </div>
            <div className="flex flex-col w-full justify-center pl-4">
                <p className="text-2xl font-mono">Your Investments</p>
            </div>
            <div className="flex flex-col pt-4 gap-4 w-full items-center justify-center">
                <StakeCard />
            </div>
            <div className="flex flex-col gap-4 w-full justify-center pl-4 pt-4">
                <p className="text-2xl font-mono">Your Portfolio</p>
                <div className="grid grid-cols-2 gap-4">
                    <PortfolioCard />
                    <StakeDistribution />
                </div>
            </div>
        </div>
    )
}