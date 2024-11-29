// import React, { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectItem } from "@/components/ui/select";



// import { Check, Trash } from 'lucide-react';

// const categories = ['Dairy', 'Vegetables', 'Bakery', 'Fruits', 'Meat', 'Snacks'];

// function ItemForm({ onAddItem }) {
//   const [itemName, setItemName] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [category, setCategory] = useState(categories[0]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!itemName.trim()) return;
//     onAddItem({ name: itemName, quantity, category, bought: false });
//     setItemName('');
//     setQuantity(1);
//     setCategory(categories[0]);
//   };

//   return (
//     <Card className="mb-4">
//       <CardHeader>
//         <CardTitle>Add Item</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-2 mb-2">
//             <Input 
//               type="text" 
//               placeholder="Item Name" 
//               value={itemName}
//               onChange={(e) => setItemName(e.target.value)} 
//             />
//             <Input 
//               type="number" 
//               placeholder="Quantity" 
//               value={quantity}
//               onChange={(e) => setQuantity(Number(e.target.value))} 
//             />
//             <Select value={category} onChange={setCategory}>
//               {categories.map(cat => <SelectItem key={cat}>{cat}</SelectItem>)}
//             </Select>
//           </div>
//           <Button type="submit">Save</Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

// function ItemList({ items, onToggle, onDelete }) {
//   return (
//     <div className="space-y-2">
//       {items.map(item => (
//         <Card key={item.name} className="flex justify-between items-center">
//           <CardContent className="flex-grow">
//             <div>{item.name} - {item.quantity} - {item.category}</div>
//           </CardContent>
//           <div className="flex items-center">
//             <Button variant="ghost" size="icon" onClick={() => onToggle(item.name)}>
//               <Check className="h-4 w-4" />
//             </Button>
//             <Button variant="ghost" size="icon" onClick={() => onDelete(item.name)}>
//               <Trash className="h-4 w-4" />
//             </Button>
//           </div>
//         </Card>
//       ))}
//     </div>
//   );
// }

// export default function App() {
//   const [items, setItems] = useState([]);
//   const [showBought, setShowBought] = useState(false);

//   useEffect(() => {
//     const savedItems = JSON.parse(localStorage.getItem('shoppingList') || '[]');
//     setItems(savedItems);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('shoppingList', JSON.stringify(items));
//   }, [items]);

//   const addItem = (item) => {
//     setItems(prev => [...prev, item]);
//   };

//   const toggleItem = (name) => {
//     setItems(prev => 
//       prev.map(item => 
//         item.name === name ? { ...item, bought: !item.bought } : item
//       )
//     );
//   };

//   const deleteItem = (name) => {
//     setItems(prev => prev.filter(item => item.name !== name));
//   };

//   const boughtItems = items.filter(item => item.bought);
//   const activeItems = items.filter(item => !item.bought);

//   return (
//     <div className="container mx-auto p-4 max-w-md">
//       <ItemForm onAddItem={addItem} />
//       <Button onClick={() => setShowBought(!showBought)} className="mb-4">
//         {showBought ? 'Show All Items' : 'Show Bought Items'}
//       </Button>
//       {showBought ? (
//         <ItemList items={boughtItems} onToggle={toggleItem} onDelete={deleteItem} />
//       ) : (
//         <ItemList items={activeItems} onToggle={toggleItem} onDelete={deleteItem} />
//       )}
//     </div>
//   );
// }