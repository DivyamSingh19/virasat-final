import Image from "next/image";
import { Button } from "../ui/button";

const AlumniCard = ({
  name,
  company,
  role,
  exp,
  image,
  prevComp
}: {
  name: string;
  company: string;
  role: string;
  exp: string;
  image: string;
  prevComp: string;
}) => (
  <div className="grid grid-cols-2 gap-4 mt-6 bg-background shadow p-4 border rounded-xl">
    <div className="flex flex-col justify-between gap-2">
      <div>
        <h1 className="font-bold text-xl">{name}</h1>
        <div className="flex gap-2">
          <h2 className="font-medium">
            {role} @{company}
          </h2>
          •<h3 className="font-medium">{exp}yrs</h3>
        </div>
        <h3 className="flex flex-col gap-2 mt-4"><span>Previous Companies:</span> <Image src={prevComp} alt="" width={90} height={20} /> </h3>
      </div>
      <Button className="mt-4">View Profile</Button>
    </div>
    <div className="">
      <Image
        src={image}
        alt="profile photo"
        className="max-w-full h-full object-cover"
        width={300}
        height={300}
      />
    </div>
  </div>
);

export default AlumniCard;
