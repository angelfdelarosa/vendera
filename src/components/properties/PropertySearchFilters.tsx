
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Building, DollarSign, Search } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface PropertySearchFiltersProps {
  locations: string[];
  propertyTypes: string[];
  onSearch: (filters: {
    location: string;
    type: string;
    priceRange: [number, number];
  }) => void;
}

const MAX_PRICE = 5000000;

export function PropertySearchFilters({
  locations,
  propertyTypes,
  onSearch,
}: PropertySearchFiltersProps) {
  const { t } = useTranslation();
  const [location, setLocation] = useState("all");
  const [type, setType] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);

  const handleSearch = () => {
    onSearch({
      location: location === "all" ? "" : location,
      type: type === "all" ? "" : type,
      priceRange,
    });
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-2 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location-select" className="sr-only">
                {t('search.location')}
              </label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location-select" className="w-full">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder={t('search.location')} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.allLocations')}</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="type-select" className="sr-only">
                {t('search.propertyType')}
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type-select" className="w-full">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder={t('search.propertyType')} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.allTypes')}</SelectItem>
                  {propertyTypes.map((pt) => (
                    <SelectItem key={pt} value={pt}>
                      {t(`property.types.${pt}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                {t('search.priceRange')}
              </span>
              <span className="font-medium text-primary">
                ${priceRange[0].toLocaleString()} -{" "}
                {priceRange[1] === MAX_PRICE
                  ? `${MAX_PRICE.toLocaleString()}+`
                  : priceRange[1].toLocaleString()}
              </span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              min={0}
              max={MAX_PRICE}
              step={100000}
              className="w-full"
            />
          </div>

          <Button onClick={handleSearch} className="w-full" size="lg">
            <Search className="mr-2 h-4 w-4" />
            {t('search.button')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
