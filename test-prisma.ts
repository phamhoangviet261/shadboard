import { db } from "./src/lib/prisma";
console.log(db.product.fields ? "fields supported" : "fields NOT supported");
