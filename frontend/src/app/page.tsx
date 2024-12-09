import {redirect} from "next/navigation";

// Головна сторінка (/)
export default function Home() {
  redirect("/login");
}
