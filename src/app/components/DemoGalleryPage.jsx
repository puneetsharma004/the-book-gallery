// "use client";

// import { useState, useMemo } from "react";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge"; 
// import { Button } from "@/components/ui/button"; 
// import { BookOpen, List, CheckCircle, Pencil, ArrowLeft } from "lucide-react"; 
// import Link from "next/link";

// // --- Static Demo Data ---
// const DEMO_BOOKS = [
//     {
//         id: 101,
//         title: "Dune",
//         cover: "https://covers.openlibrary.org/b/id/13257321-L.jpg",
//         status: "reading",
//         notes: "Starting this classic finally! The world-building is incredibly dense but rewarding. I'm focusing on the political structures and ecological themes.",
//     },
//     {
//         id: 102,
//         title: "The Name of the Wind (The Kingkiller Chronicle)",
//         cover: "https://covers.openlibrary.org/b/id/8254427-L.jpg",
//         status: "read",
//         notes: "Absolutely epic storytelling. Kvothe's journey feels intensely personal. A masterpiece of fantasy prose. Highly recommend!",
//     },
//     {
//         id: 103,
//         title: "The Hitchhiker's Guide to the Galaxy",
//         cover: "https://covers.openlibrary.org/b/id/10188059-L.jpg",
//         status: "want",
//         notes: "Heard the audio adaptation is brilliant. Must pick this up next for a light, fun read.",
//     },
//     {
//         id: 104,
//         title: "Pride and Prejudice",
//         cover: "https://covers.openlibrary.org/b/id/14354276-L.jpg",
//         status: "read",
//         notes: "A beautiful commentary on societal norms and expectations. Elizabeth and Darcy's dynamic is timeless and sharp.",
//     },
//     {
//         id: 105,
//         title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
//         cover: "https://covers.openlibrary.org/b/id/10531500-L.jpg",
//         status: "reading",
//         notes: "Great practical advice. Applying the 'make it obvious' rule to my morning routine. Very actionable book.",
//     },
//     {
//         id: 106,
//         title: "To Kill a Mockingbird",
//         cover: "https://covers.openlibrary.org/b/id/926610-L.jpg",
//         status: "read",
//         notes: null, // Example of a book read without notes
//     },
//     {
//         id: 107,
//         title: "Sapiens: A Brief History of Humankind",
//         cover: "https://covers.openlibrary.org/b/id/8302195-L.jpg",
//         status: "want",
//         notes: null,
//     },
// ];


// // --- Configuration (Same as PublicProfilePage) ---
// const STATUS_DETAILS = {
//   reading: { label: "Currently Reading", icon: BookOpen, className: "bg-blue-500 text-white hover:bg-blue-600" },
//   want: { label: "Want to Read", icon: Pencil, className: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
//   read: { label: "Finished Reading", icon: CheckCircle, className: "bg-green-500 text-white hover:bg-green-600" },
// };

// const FILTERS = [
//   { value: "all", label: "All", Icon: List },
//   { value: "reading", label: STATUS_DETAILS.reading.label, Icon: BookOpen },
//   { value: "want", label: STATUS_DETAILS.want.label, Icon: Pencil },
//   { value: "read", label: STATUS_DETAILS.read.label, Icon: CheckCircle },
// ];


// export default function DemoGalleryPage() {
//   const [filter, setFilter] = useState("all");
//   const username = "The Book Gallery Demo"; // Static username for the demo

//   // Memoize filtered books for display based on the static data
//   const filteredBooks = useMemo(() => {
//     if (filter === "all") return DEMO_BOOKS;
//     return DEMO_BOOKS.filter((book) => book.status === filter);
//   }, [filter]);
  
//   // Calculate counts for filters
//   const filterCounts = useMemo(() => {
//     const counts = { all: DEMO_BOOKS.length, reading: 0, want: 0, read: 0 };
//     DEMO_BOOKS.forEach(book => {
//       counts[book.status]++;
//     });
//     return counts;
//   }, [DEMO_BOOKS]);


//   return (
//     <main className="min-h-screen bg-neutral-50 p-6">
//       <div className="max-w-5xl mx-auto py-8">
        
//         {/* --- Header & Title --- */}
//         <header className="text-center mb-10 bg-white p-6 rounded-xl shadow-lg border border-neutral-100">
//             {/* Back to landing page link */}
//             <div className="flex justify-between items-center mb-4">
//                 <Link href="/" passHref>
//                     <Button variant="ghost" className="text-neutral-600 hover:text-blue-600">
//                         <ArrowLeft className="w-4 h-4 mr-2" />
//                         Back to Landing Page
//                     </Button>
//                 </Link>
//                 {/* Space for right side content if needed, kept empty for centering */}
//                 <div className="w-24"></div> 
//             </div>

//           <h1 className="text-4xl font-extrabold text-neutral-900 mb-2">
//             📚 {username}'s Book Gallery
//           </h1>
//           <p className="text-lg text-neutral-600">
//             A real-time look at how your public profile will appear.
//           </p>
//         </header>

//         {/* --- Filter Section --- */}
//         <section aria-labelledby="filter-heading" className="mb-8">
//           <h2 id="filter-heading" className="sr-only">
//             Filter books by status
//           </h2>
//           <div 
//             className="flex flex-wrap gap-3 justify-center"
//             role="tablist"
//             aria-label="Book status filters"
//           >
//             {FILTERS.map(({ value, label, Icon }) => (
//               <Button
//                 key={value}
//                 variant={filter === value ? "default" : "outline"}
//                 onClick={() => setFilter(value)}
//                 role="tab"
//                 aria-selected={filter === value}
//                 className={`transition-all ${filter === value ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-neutral-100'}`}
//               >
//                 <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
//                 {label} ({filterCounts[value]})
//               </Button>
//             ))}
//           </div>
//         </section>

//         {/* --- Content Grid --- */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
//           {filteredBooks.map((book) => {
//             const status = STATUS_DETAILS[book.status] || STATUS_DETAILS.reading;
            
//             return (
//               <Card 
//                 key={book.id} 
//                 className="rounded-xl shadow-md transition-shadow hover:shadow-lg flex flex-col h-full"
//               >
//                 <CardHeader className="pb-3 space-y-2">
//                   <h2 className="font-semibold text-lg line-clamp-2 text-neutral-800">
//                     {book.title}
//                   </h2>
//                   <Badge 
//                     className={`w-fit text-sm font-medium ${status.className}`}
//                   >
//                     <status.icon className="mr-1 h-3 w-3" aria-hidden="true" />
//                     {status.label}
//                   </Badge>
//                 </CardHeader>
                
//                 <CardContent className="space-y-3 flex-1">
//                   {/* Book Cover */}
//                   {book.cover && book.cover !== "N/A" ? (
//                     <img
//                       src={book.cover}
//                       alt={`Cover of ${book.title}`}
//                       className="w-full h-48 object-cover rounded-md shadow-sm"
//                       loading="lazy"
//                     />
//                   ) : (
//                     <div 
//                       className="w-full h-48 bg-neutral-100 border border-dashed border-neutral-300 rounded-md flex items-center justify-center text-neutral-500 text-sm"
//                       role="img"
//                       aria-label={`No cover image available for ${book.title}`}
//                     >
//                       No cover available
//                     </div>
//                   )}

//                   {/* Notes */}
//                   {book.notes && (
//                     <p className="text-sm mt-2 text-neutral-700 line-clamp-3">
//                       <strong className="font-medium text-neutral-800">Notes:</strong> {book.notes}
//                     </p>
//                   )}
//                   {!book.notes && book.status !== 'want' && (
//                      <p className="text-sm italic text-neutral-500">
//                         No public notes available for this entry.
//                     </p>
//                   )}
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       </div>
//     </main>
//   );
// }