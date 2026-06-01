import LocationSelector from "../components/LocationSelector";

export default function page() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Test Location Dropdown</h1>
      <LocationSelector />
    </main>
  );
}