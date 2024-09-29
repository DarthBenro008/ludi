import Dice from 'react-dice-roll';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from "@/components/ui/input"
import { Label as LabelUI } from "@/components/ui/label"
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { LudiContract, VrfImpl } from '@/sway-api';
import { contractId } from '@/lib';
import { useWallet } from '@fuels/react';
import { useNotification } from '@/hooks/useNotification';
import { getRandomB256 } from 'fuels';

export default function Gamble({updateBalance}: {updateBalance: () => void}) {
    const [betAmount, setBetAmount] = useState(0);
    const [betNumber, setBetNumber] = useState<1 | 2 | 3 | 4 | 5 | 6 | undefined>(undefined);
    const [cheatValue, setCheatValue] = useState<1 | 2 | 3 | 4 | 5 | 6 | undefined>(undefined);
    const [betInProgress, setBetInProgress] = useState(false);
    const {
        errorNotification,
        transactionSubmitNotification,
        transactionSuccessNotification,
    } = useNotification();
    const { wallet } = useWallet();
    const [contract, setContract] = useState<LudiContract>();
    useEffect(() => {
        if (wallet) {
            setContract(new LudiContract(contractId, wallet));
        }
    }, [wallet]);


    const handleBet = async () => {
        setBetInProgress(true);
        try {
            const vrfContract = new VrfImpl("0x749a7eefd3494f549a248cdcaaa174c1a19f0c1d7898fa7723b6b2f8ecc4828d", wallet!!);
            const asset = contract?.provider.getBaseAssetId();
            const call = await contract!!.functions.roll_dice(getRandomB256()).callParams({
                forward: [betAmount * 1000000000, asset as string],
            }).addContracts([vrfContract]).call();
            transactionSubmitNotification(call.transactionId);
            const result = await call.waitForResult();
            transactionSuccessNotification(result.transactionId);
            console.log(result.logs)
            if(result.logs[0].result) {
                console.log("You won!")
                setCheatValue(betNumber);
                setTimeout(() => {
                    transactionSuccessNotification("You won!")
                }, 1000);
            } else {
                console.log("You lost!")
                let randomNumber = Math.floor(Math.random() * 6) + 1;
                while (randomNumber === betNumber) {
                    randomNumber = Math.floor(Math.random() * 6) + 1;
                }
                setCheatValue(randomNumber as 1 | 2 | 3 | 4 | 5 | 6 | undefined);
                setTimeout(() => {
                    errorNotification("You lost!")
                    updateBalance();
                }, 1000);
            }
        } catch (e) {
            console.log(e);
        }
        const event = new KeyboardEvent('keypress', {
            key: 'Enter', // Simulating the 'Enter' key
            keyCode: 13,  // The Enter key's code is 13
            code: 'Enter',
            charCode: 13,
            bubbles: true, // Make sure the event bubbles up
        });
        window.document.dispatchEvent(event);
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col w-full items-center justify-center">
                <p className="text-4xl font-mono">Gamble</p>
            </div>
            <div>
                <p className="text-2xl font-mono">Roll the dice</p>
                <p className="text-sm text-gray-500">A simple game of chance! Decide a number between 1 and 6 and roll the dice. If you roll the same number, you win!</p>
            </div>
            <div className='flex justify-center pt-6'>
                <Card className='w-[600px]'>
                    <CardContent className='p-4 flex flex-col gap-4'>
                        <CardTitle>Enter your bet values</CardTitle>
                        <div className='flex flex-col gap-2'>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <LabelUI htmlFor="name" className="text-right">
                                    ETH Amount
                                </LabelUI>
                                <Input id="name" type="number" value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <LabelUI htmlFor="name" className="text-right">
                                    Bet Number
                                </LabelUI>
                                <Input id="name" type="number" value={betNumber} onChange={(e) => setBetNumber(Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 | undefined)} className="col-span-3" />
                            </div>
                        </div>
                        <Button onClick={handleBet}>Bet</Button>
                    </CardContent>
                </Card>
            </div>
            <div className='pt-10 flex justify-center'>
                <Dice triggers={['Enter']} cheatValue={cheatValue} rollingTime={1000} />
            </div>
        </div>
    )
}