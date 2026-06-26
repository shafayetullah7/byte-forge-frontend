import { useParams, Navigate } from "@solidjs/router";

export default function EditPlantPage() {
  const params = useParams();
  return <Navigate href={`/app/seller/products/plants/${params.plantId}`} />;
}
