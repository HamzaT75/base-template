// import React, { useState, useEffect } from 'react';
// import { 
//   Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
//   Input, Button, Label, Select, SelectItem, 
//   Table, TableHeader, TableBody, TableRow, TableCell
// } from "@/components/ui";
// import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// function StockManagementApp() {
//   const [stocks, setStocks] = useState([]);
//   const [newStock, setNewStock] = useState({
//     name: '', industry: '', shares: 0, purchasePrice: 0, purchaseDate: '', dividendAmount: 0, payoutFrequency: 'quarterly'
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStock, setSelectedStock] = useState(null);

//   const addStock = () => {
//     if(newStock.name && newStock.industry) {
//       setStocks(prev => [...prev, { ...newStock, id: Date.now(), dividends: [], notes: '' }]);
//       setNewStock({
//         name: '', industry: '', shares: 0, purchasePrice: 0, purchaseDate: '', dividendAmount: 0, payoutFrequency: 'quarterly'
//       });
//     }
//   };

//   const updateStock = (id, field, value) => {
//     setStocks(prev => 
//       prev.map(stock => stock.id === id ? { ...stock, [field]: value } : stock)
//     );
//   };

//   const removeStock = (id) => {
//     setStocks(prev => prev.filter(stock => stock.id !== id));
//   };

//   const addDividend = (id, amount, date) => {
//     setStocks(prev => 
//       prev.map(stock => 
//         stock.id === id ? { ...stock, dividends: [...stock.dividends, { amount, date }] } : stock
//       )
//     );
//   };

//   const totalDividends = (period = 'yearly') => {
//     const now = new Date();
//     return stocks.reduce((total, stock) => {
//       const validDividends = stock.dividends.filter(d => {
//         const divDate = new Date(d.date);
//         const diffTime = now - divDate;
//         const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
//         return period === 'yearly' ? diffYears <= 1 : 
//                period === 'monthly' ? diffYears <= 1/12 : 
//                diffYears <= 1/4;
//       });
//       return total + validDividends.reduce((sum, div) => sum + parseFloat(div.amount), 0);
//     }, 0);
//   };

//   const industryDiversification = () => {
//     return stocks.reduce((acc, stock) => {
//       acc[stock.industry] = (acc[stock.industry] || 0) + 1;
//       return acc;
//     }, {});
//   };

//   const filteredStocks = stocks.filter(stock => 
//     stock.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container mx-auto p-4 sm:p-8">
//       <h1 className="text-2xl font-bold mb-4">Stock & Dividend Tracker</h1>

//       {/* Add Stock Form */}
//       <Card className="mb-4">
//         <CardHeader>
//           <CardTitle>Add New Stock</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <Input 
//               value={newStock.name} 
//               onChange={e => setNewStock({...newStock, name: e.target.value})}
//               placeholder="Stock Name" 
//             />
//             <Select value={newStock.industry} onValueChange={value => setNewStock({...newStock, industry: value})}>
//               <SelectItem value="Tech">Tech</SelectItem>
//               <SelectItem value="Finance">Finance</SelectItem>
//               <SelectItem value="Health">Health</SelectItem>
//               <SelectItem value="Energy">Energy</SelectItem>
//             </Select>
//             <Input type="number" value={newStock.shares} onChange={e => setNewStock({...newStock, shares: e.target.value})} placeholder="Shares" />
//             <Input type="number" value={newStock.purchasePrice} onChange={e => setNewStock({...newStock, purchasePrice: e.target.value})} placeholder="Purchase Price" />
//             <Input type="date" value={newStock.purchaseDate} onChange={e => setNewStock({...newStock, purchaseDate: e.target.value})} />
//             <Input type="number" value={newStock.dividendAmount} onChange={e => setNewStock({...newStock, dividendAmount: e.target.value})} placeholder="Dividend Amount" />
//             <Select value={newStock.payoutFrequency} onValueChange={value => setNewStock({...newStock, payoutFrequency: value})}>
//               <SelectItem value="quarterly">Quarterly</SelectItem>
//               <SelectItem value="annually">Annually</SelectItem>
//             </Select>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button onClick={addStock}>Add Stock</Button>
//         </CardFooter>
//       </Card>

//       {/* Search Bar */}
//       <Input 
//         className="mb-4" 
//         placeholder="Search stocks..." 
//         value={searchTerm} 
//         onChange={e => setSearchTerm(e.target.value)}
//       />

//       {/* Stock List */}
//       <div className="grid gap-4">
//         {filteredStocks.map(stock => (
//           <StockItem 
//             key={stock.id} 
//             stock={stock} 
//             updateStock={updateStock} 
//             removeStock={removeStock} 
//             addDividend={addDividend}
//             setSelectedStock={setSelectedStock}
//           />
//         ))}
//       </div>

//       {/* Summary */}
//       <Card className="mt-4">
//         <CardHeader>
//           <CardTitle>Dividend Summary</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>Total Dividends This Year: ${totalDividends('yearly').toFixed(2)}</p>
//           <p>Total Dividends This Quarter: ${totalDividends('quarterly').toFixed(2)}</p>
//           <p>Total Dividends This Month: ${totalDividends('monthly').toFixed(2)}</p>
//         </CardContent>
//       </Card>

//       {/* Diversification Chart */}
//       <div className="mt-4">
//         <h2 className="text-lg font-semibold">Industry Diversification</h2>
//         <PieChart width={300} height={300}>
//           <Pie 
//             data={Object.entries(industryDiversification()).map(([name, value]) => ({ name, value }))} 
//             cx="50%" cy="50%" outerRadius={80} 
//             fill="#8884d8" 
//             dataKey="value"
//           >
//             {Object.entries(industryDiversification()).map((_, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </div>

//       {selectedStock && <StockDetails stock={selectedStock} setSelectedStock={setSelectedStock} />}
//     </div>
//   );
// }

// function StockItem({ stock, updateStock, removeStock, addDividend, setSelectedStock }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [tempStock, setTempStock] = useState({...stock});

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{stock.name}</CardTitle>
//         <CardDescription>{stock.industry}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {isEditing ? (
//           <div>
//             <Input 
//               value={tempStock.shares} 
//               onChange={e => setTempStock({...tempStock, shares: e.target.value})} 
//               type="number" 
//               placeholder="Shares" 
//             />
//             <Input 
//               value={tempStock.purchasePrice} 
//               onChange={e => setTempStock({...tempStock, purchasePrice: e.target.value})} 
//               type="number" 
//               placeholder="Purchase Price" 
//             />
//           </div>
//         ) : (
//           <div>
//             <p>Shares: {stock.shares}</p>
//             <p>Purchase Price: ${stock.purchasePrice}</p>
//           </div>
//         )}
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         <Button onClick={() => {
//           if (isEditing) {
//             updateStock(stock.id, 'shares', tempStock.shares);
//             updateStock(stock.id, 'purchasePrice', tempStock.purchasePrice);
//           }
//           setIsEditing(!isEditing);
//         }}>
//           {isEditing ? 'Save' : 'Edit'}
//         </Button>
//         <Button onClick={() => removeStock(stock.id)} variant="destructive">Remove</Button>
//         <Button onClick={() => {
//           const amount = prompt('Enter dividend amount:');
//           const date = prompt('Enter dividend date (YYYY-MM-DD):');
//           if (amount && date) addDividend(stock.id, amount, date);
//         }}>Add Dividend</Button>
//         <Button onClick={() => setSelectedStock(stock)}>View Details</Button>
//       </CardFooter>
//     </Card>
//   );
// }

// function StockDetails({ stock, setSelectedStock }) {
//   return (
//     <Card className="mt-4">
//       <CardHeader>
//         <CardTitle>{stock.name} Details</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Label>Notes:</Label>
//         <textarea 
//           className="w-full h-20 p-2 border rounded mt-2" 
//           value={stock.notes} 
//           onChange={e => updateStock(stock.id, 'notes', e.target.value)}
//         />
//         <h3 className="mt-4">Dividend History</h3>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell>Amount</TableCell>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {stock.dividends.map((div, idx) => (
//               <TableRow key={idx}>
//                 <TableCell>{div.date}</TableCell>
//                 <TableCell>${div.amount}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//       <CardFooter>
//         <Button onClick={() => setSelectedStock(null)}>Close</Button>
//       </CardFooter>
//     </Card>
//   );
// }

// export default function App() {
//   return <StockManagementApp />;
// }