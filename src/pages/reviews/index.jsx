import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Delete, Icon, ShoppingBasket, Trash2 } from "lucide-react";
import { DeleteData, GetData } from "@/api/authApi";
import axios from "axios";
import { Button } from "@/components/ui/button";

const Reviews = () => {
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        const fetchReviews = async () => {
            const data = await GetData("/api/reviews/");
            setReviews(data);
        };
        fetchReviews();
    }, []);

    const [expanded, setExpanded] = useState("");
    const toggleExpand = (id) => {

        setExpanded(id);
    };
    const handleDelete = async (id) => {
        const response = await DeleteData("/api/reviews/", id+"/");
      
    }

    return (
        <div>
            <div className="m-6 mb-12 text-xl font-semibold">Boshqaruv Paneli</div>
            <Table className>
                <TableCaption>Yaqinda yozilgan sharhlaringiz.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead >ID</TableHead>
                        <TableHead >Ism</TableHead>
                        <TableHead>Sharh</TableHead>
                        <TableHead>Harakatlar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reviews.map((review) => (
                        <TableRow key={review.comment}>
                            <TableCell className="font-medium">{review.review_id}</TableCell>
                            <TableCell>{review.comment}</TableCell>
                            <TableCell>
                                <p
                                    onClick={() => toggleExpand(review.review_id)}
                                    className={`${expanded === review.review_id ? "" : "line-clamp-1 !overflow-hidden  w-[250px]"} `}>
                                    {review.comment}
                                </p>
                                <div>
                                    <button
                                        onClick={() => toggleExpand(null)}
                                        className="text-blue-600 mt-2"
                                    >
                                        {expanded === review.review_id ? "Yashirish" : ""}
                                    </button>
                                </div>

                            </TableCell>
                            <TableCell>
                                <Button onClick={()=>handleDelete(review.review_id)}  variant="outline" className="bg-transparent" >
                                    <Trash2 className="" />
                                </Button>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default Reviews;
