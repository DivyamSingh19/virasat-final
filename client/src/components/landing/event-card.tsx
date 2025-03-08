import Image from "next/image";
import { Button } from "../ui/button";

const EventCard = ({
  name,
  date,
  type,
  image
}: {
  name: string;
  date: string;
  type: string;
  image: string;
}) => (
  <div className="grid grid-cols-2 gap-4 mt-6 bg-background shadow p-4 border rounded-xl">
    <div className="">
      <Image
        src={image}
        alt="profile photo"
        className="max-w-full h-full object-cover"
        width={300}
        height={300}
      />
    </div>
    <div className="flex flex-col justify-between gap-2">
      <div>
        <h1 className="font-bold text-xl">{name}</h1>
        <div className="flex flex-col gap-1">
          <h2 className="font-medium">
            Date: {date}
          </h2>
          <h3 className="font-medium">{type}</h3>
        </div>
      </div>
      <Button className="mt-4">View More</Button>
    </div>
  </div>
);

export default EventCard;
