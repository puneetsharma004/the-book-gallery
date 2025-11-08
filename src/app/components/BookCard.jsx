// import React, { useMemo, useRef } from "react";
// import { motion } from "framer-motion";

// // Shadcn UI Components (Assuming you import these from your components directory)
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge"; 
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";

// // Icons
// import { Trash2, Loader2, BookOpen, Pencil } from "lucide-react";

// // --- Configuration (Kept as provided) ---

// const STATUS_OPTIONS = [
//   { value: "reading", label: "📖 Currently Reading" },
//   { value: "want", label: "📝 Want to Read" },
//   { value: "read", label: "✅ Finished Reading" },
// ];

// const cardVariants = {
//   hidden: { opacity: 0, scale: 0.95 },
//   visible: { 
//     opacity: 1, 
//     scale: 1,
//     transition: { duration: 0.2, ease: "easeOut" }
//   },
//   exit: { 
//     opacity: 0, 
//     scale: 0.95,
//     transition: { duration: 0.15, ease: "easeIn" }
//   }
// };




// // --- Component Definition ---

// export function BookCard({ book, onDelete, onUpdate, isOpen, onOpenChange }) {
//   const dialogTriggerRef = useRef(null);

//   const statusMap = useMemo(() => ({
//     reading: { label: "Reading", className: "bg-blue-500 text-white hover:bg-blue-600" },
//     want: { label: "Want to Read", className: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
//     read: { label: "Finished", className: "bg-green-500 text-white hover:bg-green-600" },
//   }), []);

//   const { label: statusLabel, className: statusClass } = statusMap[book.status] || statusMap.reading;
//   const isFetching = book.isFetching;
// const cover = book.cover_url || book.cover || null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <motion.div
//         layout
//         variants={cardVariants}
//         initial="hidden"
//         animate="visible"
//         whileHover={{ scale: 1.03, rotateY: 4 }}
//         transition={{ type: "spring", stiffness: 180, damping: 12 }}
//         exit="exit"
//         className="h-full"
//       >
//           <Card 
//             className="relative glass rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]
//             hover:shadow-[0_12px_45px_rgba(0,0,0,0.55)] transition-all duration-500 overflow-hidden"
//             role="group"
//           >

          
//           {/* Dialog Trigger wraps the entire visible card content for a large click target */}
//           <DialogTrigger asChild>
//             <button
//               ref={dialogTriggerRef}
//               className="text-left w-full flex-1 flex flex-col focus:outline-none rounded-lg"
//               aria-label={`View details and edit status for ${book.title}`}
//             >
//               <CardHeader className="pb-3 pr-10">
//                 <h3 className="font-semibold text-white leading-tight">{book.title}</h3>
//                 {isFetching ? (
//                   <div className="absolute top-3 right-3 flex items-center text-blue-500">
//                     <Loader2 className="h-5 w-5 animate-spin" aria-label="Fetching cover..." />
//                   </div>
//                 ) : (
//                   <Badge className={`px-2 py-0.5 text-xs rounded-full shadow-lg ${statusClass}`}>
//                     {statusLabel}
//                   </Badge>

//                 )}
//               </CardHeader>

//               <CardContent className="space-y-3 flex-1 flex flex-col">
        
//                 {/* Book Cover */}
//                 {!isFetching && cover ? (
//                 <div className="relative group">
//                   <img
//                     src={cover}
//                     alt={book.title}
//                     className="w-full h-[260px] object-cover rounded-lg transition-transform duration-500 group-hover:scale-[1.05]"
//                   />


//                    {/* Book Spine */}
//                     <div className="absolute left-0 top-0 w-[7px] h-full book-spine rounded-l-lg"></div>

//                   {/* Subtle hover highlight */}
//                   <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                 </div>

//               ) : (
//                 <div className="w-full h-48 rounded-md border border-stone-200 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-stone-400 text-sm">
//                   {isFetching ? (
//                     <Loader2 className="absolute top-3 right-3 h-5 w-5 animate-spin text-amber-600" />
//                   ) : (
//                     <Badge
//                       className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-medium shadow-sm ${statusClass}`}
//                     >
//                       {statusLabel}
//                     </Badge>
//                   )}
//                 </div>
//               )}

//               <h3 className="font-semibold text-white line-clamp-2">{book.title}</h3>
                
//                <p className="text-xs text-white/60">
//                 Notes: {book.notes ? book.notes.split('\n')[0] : 'No notes yet.'}
//               </p>

//               </CardContent>
//             </button>
//           </DialogTrigger>

//           {/* Book Detail Modal */}
//           <DialogContent
//             forceMount
//             className="max-w-md p-0 overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl bg-white/10 shadow-[0_8px_50px_rgba(0,0,0,0.65)] text-white"
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.92, y: 12 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.92, y: 12 }}
//               transition={{ duration: 0.25, ease: "easeOut" }}
//             >

//               {/* HEADER */}
//               <div className="p-5 border-b border-white/10 bg-white/5">
//                 <DialogHeader>
//                   <DialogTitle className="text-lg font-semibold">
//                     {book.title}
//                   </DialogTitle>
//                   {book.author && (
//                     <DialogDescription className="text-white/50 text-sm">
//                       {book.author}
//                     </DialogDescription>
//                   )}
//                 </DialogHeader>
//               </div>

//               {/* BODY */}
//               <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto scrollbar-none">

//                 {/* HERO COVER */}
//                 <div className="flex justify-center">
//                   <div className="relative">
//                     <img
//                       src={book.cover_url || "/placeholder-book.png"}
//                       alt={book.title}
//                       className="w-28 h-44 object-cover rounded-md shadow-xl"
//                     />
//                     <div className="absolute left-0 top-0 w-[6px] h-full bg-gradient-to-r from-white/25 to-transparent rounded-l-md" />
//                   </div>
//                 </div>

//                 {/* STATUS SELECTOR — Segmented Glass */}
//                 <div>
//                   <label className="text-sm font-medium text-white/80 flex items-center gap-2 mb-2">
//                     <BookOpen className="h-4 w-4 text-white/60" />
//                     Reading Status
//                   </label>

//                   <div className="grid grid-cols-3 gap-2">
//                     {[
//                       { value: "reading", label: "Reading", icon: "📖" },
//                       { value: "want", label: "Want", icon: "📝" },
//                       { value: "read", label: "Finished", icon: "✅" },
//                     ].map((option) => (
//                       <button
//                         key={option.value}
//                         onClick={() => onUpdate(book.id, "status", option.value)}
//                         className={`p-3 rounded-md border backdrop-blur-md transition text-center
//                           ${
//                             book.status === option.value
//                               ? "bg-white/20 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.25)]"
//                               : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
//                           }`}
//                       >
//                         <div className="text-lg">{option.icon}</div>
//                         <div className="text-[11px] mt-1">{option.label}</div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* NOTES */}
//                 <div>
//                   <label className="text-sm font-medium text-white/80 flex items-center gap-2 mb-2">
//                     <Pencil className="h-4 w-4 text-white/60" />
//                     Personal Notes
//                   </label>

//                   <textarea
//                     id="notes-modal-input"
//                     value={book.notes}
//                     onChange={(e) => onUpdate(book.id, "notes", e.target.value)}
//                     rows={4}
//                     className="w-full p-3 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/40 backdrop-blur-sm focus:border-white/40 focus:ring-white/20 transition resize-none"
//                     placeholder="Write your thoughts, summaries, or favorite highlights..."
//                   />
//                 </div>

//               </div>

//               {/* FOOTER */}
//               <DialogFooter className="p-4 border-t border-white/10 flex gap-3 justify-end">

//                 <Button
//                   variant="ghost"
//                   onClick={() => onDelete(book.id, book.title)}
//                   className="text-red-300 hover:text-red-200 hover:bg-red-400/10 rounded-md"
//                 >
//                   <Trash2 className="h-4 w-4 mr-1" />
//                   Delete
//                 </Button>

//                 <Button
//                   onClick={() => onOpenChange(false)}
//                   className="bg-white/15 border border-white/30 text-white hover:bg-white/20 rounded-md px-5"
//                 >
//                   Done
//                 </Button>

//               </DialogFooter>

//             </motion.div>
//           </DialogContent>

//         </Card>
//       </motion.div>
//     </Dialog>
//   );
// }