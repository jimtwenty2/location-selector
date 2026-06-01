import LocationSelector from "../components/LocationSelector";

export default function page() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-4xl font-bold underline text-center">Location Selector</h1>
      <LocationSelector />
    </main>
  );
}