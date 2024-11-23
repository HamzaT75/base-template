import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const words = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon', 'Mango', 'Nectarine', 'Orange', 'Papaya', 'Quince', 'Raspberry', 'Strawberry', 'Tangerine', 'Ugli', 'Watermelon'];

function generateGrid(n, m, words) {
    let grid = [];
    for(let i = 0; i < n * m; i++) {
        grid.push({ word: words[Math.floor(Math.random() * words.length)], shown: true, selected: false });
    }
    return grid;
}

export default function App() {
    const [gridSizeN, setGridSizeN] = useState(3);
    const [gridSizeM, setGridSizeM] = useState(3);
    const [viewTime, setViewTime] = useState(7);
    const [selectTime, setSelectTime] = useState(7);
    const [grid, setGrid] = useState([]);
    const [phase, setPhase] = useState('config'); // 'config', 'view', 'select', 'result'
    const [timer, setTimer] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [missedCount, setMissedCount] = useState(0);

    const startGame = () => {
        const initialGrid = generateGrid(gridSizeN, gridSizeM, words);
        setGrid(initialGrid);
        setPhase('view');
        setTimer(viewTime);
    };

    useEffect(() => {
        let interval = null;
        if (phase === 'view' || phase === 'select') {
            interval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer > 0) return prevTimer - 1;
                    if (phase === 'view') {
                        const half = Math.floor(grid.length / 2);
                        const newGrid = grid.map((cell, idx) => ({
                            ...cell,
                            shown: idx < half,
                            word: idx < half ? cell.word : words[Math.floor(Math.random() * words.length)]
                        }));
                        setGrid(newGrid);
                        setPhase('select');
                        return selectTime;
                    } else if (phase === 'select') {
                        checkResults();
                    }
                    return 0;
                });
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [phase, grid, viewTime, selectTime]);

    const toggleSelect = (index) => {
        if(phase !== 'select') return;
        const newGrid = [...grid];
        newGrid[index].selected = !newGrid[index].selected;
        setGrid(newGrid);
    };

    const checkResults = () => {
        let correct = 0, missed = 0;
        grid.forEach((cell, index) => {
            if (cell.shown && cell.selected) correct++;
            if (cell.shown && !cell.selected) missed++;
        });
        setCorrectCount(correct);
        setMissedCount(missed);
        setPhase('result');
    };

    const resetGame = () => {
        setPhase('config');
        setGrid([]);
        setCorrectCount(0);
        setMissedCount(0);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
            <Card className="w-full max-w-lg p-6">
                <CardHeader>
                    <CardTitle>Word Memory Game</CardTitle>
                </CardHeader>
                <CardContent>
                    {phase === 'config' && (
                        <>
                            <Label htmlFor="gridSizeN">Grid Size N:</Label>
                            <Input id="gridSizeN" type="number" min="2" max="5" value={gridSizeN} onChange={e => setGridSizeN(Number(e.target.value))} className="mb-2" />
                            <Label htmlFor="gridSizeM">Grid Size M:</Label>
                            <Input id="gridSizeM" type="number" min="2" max="5" value={gridSizeM} onChange={e => setGridSizeM(Number(e.target.value))} className="mb-2" />
                            <Label htmlFor="viewTime">View Time (seconds):</Label>
                            <Input id="viewTime" type="number" min="1" max="10" value={viewTime} onChange={e => setViewTime(Number(e.target.value))} className="mb-2" />
                            <Label htmlFor="selectTime">Selection Time (seconds):</Label>
                            <Input id="selectTime" type="number" min="3" max="10" value={selectTime} onChange={e => setSelectTime(Number(e.target.value))} className="mb-4" />
                            <Button onClick={startGame}>Start Game</Button>
                        </>
                    )}
                    {(phase === 'view' || phase === 'select') && (
                        <>
                            <div className="mb-4 text-center">Time left: {timer} seconds</div>
                            <div className="grid grid-cols-{gridSizeM} gap-2">
                                {grid.map((cell, index) => (
                                    <div 
                                        key={index} 
                                        className={`p-4 text-center border rounded ${cell.shown ? 'bg-white' : 'bg-gray-200'} ${phase === 'select' && cell.shown ? 'cursor-pointer' : ''} ${cell.selected ? 'bg-blue-200' : ''}`}
                                        onClick={() => toggleSelect(index)}
                                    >
                                        {cell.shown ? cell.word : '?'}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {phase === 'select' && (
                        <Button onClick={checkResults} className="mt-4">Submit</Button>
                    )}
                    {phase === 'result' && (
                        <>
                            <p className="mb-2">Correct: {correctCount}</p>
                            <p>Missed: {missedCount}</p>
                            {missedCount === 0 && <p className="text-green-600 mt-2">You won! All words remembered correctly!</p>}
                            <Button onClick={resetGame} className="mt-4">Reset Game</Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}