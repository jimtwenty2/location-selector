"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LocationOption = {
  id: string;
  nameEn: string;
  nameKh: string;
};

type ApiResponse<T> = {
  payload: T;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LocationSelector() {
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [communes, setCommunes] = useState<LocationOption[]>([]);
  const [villages, setVillages] = useState<LocationOption[]>([]);

  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [communeId, setCommuneId] = useState("");
  const [villageId, setVillageId] = useState("");

  const [error, setError] = useState<string | null>(null);

  async function fetchLocations(url: string): Promise<LocationOption[]> {
    try {
      if (!url) {
        throw new Error("API URL is not configured");
      }
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }
      const data: ApiResponse<LocationOption[]> = await res.json();
      setError(null);
      return data.payload || [];
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch locations";
      setError(errorMessage);
      console.error("Fetch error:", errorMessage);
      return [];
    }
  }

  useEffect(() => {
    fetchLocations(`${API_BASE_URL}/locations/provinces`).then(setProvinces);
  }, []);

  useEffect(() => {
    if (!provinceId) return;

    setDistrictId("");
    setCommuneId("");
    setVillageId("");
    setDistricts([]);
    setCommunes([]);
    setVillages([]);

    fetchLocations(
      `${API_BASE_URL}/locations/provinces/${provinceId}/districts`,
    ).then(setDistricts);
  }, [provinceId]);

  useEffect(() => {
    if (!districtId) return;

    setCommuneId("");
    setVillageId("");
    setCommunes([]);
    setVillages([]);

    fetchLocations(
      `${API_BASE_URL}/locations/districts/${districtId}/communes`,
    ).then(setCommunes);
  }, [districtId]);

  useEffect(() => {
    if (!communeId) return;

    setVillageId("");
    setVillages([]);

    fetchLocations(
      `${API_BASE_URL}/locations/communes/${communeId}/villages`,
    ).then(setVillages);
  }, [communeId]);

  return (
    <Card className="w-full max-w-3xl rounded-2xl">
      <CardHeader>
        <CardTitle>Select Location</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-5 md:grid-cols-2">
        {error && (
          <div className="col-span-full rounded-md bg-red-50 p-3 text-sm text-red-800">
            ⚠️ {error}
          </div>
        )}

        <LocationSelect
          label="Province"
          placeholder="Select province"
          value={provinceId}
          options={provinces}
          onChange={setProvinceId}
          disabled={provinces.length === 0}
        />

        <LocationSelect
          label="District"
          placeholder="Select district"
          value={districtId}
          options={districts}
          disabled={!provinceId}
          onChange={setDistrictId}
        />

        <LocationSelect
          label="Commune"
          placeholder="Select commune"
          value={communeId}
          options={communes}
          disabled={!districtId}
          onChange={setCommuneId}
        />

        <LocationSelect
          label="Village"
          placeholder="Select village"
          value={villageId}
          options={villages}
          disabled={!communeId}
          onChange={setVillageId}
        />
      </CardContent>
    </Card>
  );
}

function LocationSelect({
  label,
  placeholder,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: LocationOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const isDisabled = disabled || options.length === 0;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Select value={value} onValueChange={onChange} disabled={isDisabled}>
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              options.length === 0 ? "No data available" : placeholder
            }
          />
        </SelectTrigger>

        <SelectContent className="max-h-32 overflow-y-auto">
          {options.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">
              No options available
            </div>
          ) : (
            options.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.nameEn} - {item.nameKh}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
