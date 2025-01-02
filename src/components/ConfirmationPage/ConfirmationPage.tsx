import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  BadgeCheck,
  Box,
  Check,
  Columns,
  Loader2,
  PackageCheck,
  PaintBucket,
  Ruler,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { analyzeFurniturePrice } from "../../services/furniture-api";
import { useFurnitureStore } from "../../stores/furnitureStore";
import {
  furnitureSchema,
  kuntoOptions,
  type FurnitureFormData,
} from "../../types/furniture";
import { BackButton } from "../back-button";
import LoaderAnimation from "../loader";
import PageWrapper from "../PageWrapper";

const FurniConfirmPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { furnitureResult, setPriceAnalysis } = useFurnitureStore();

  const form = useForm<FurnitureFormData>({
    resolver: zodResolver(furnitureSchema),
    defaultValues: furnitureResult || {
      requestId: "",
      merkki: "",
      malli: "",
      vari: "",
      mitat: {
        pituus: 0,
        korkeus: 0,
        leveys: 0,
      },
      materiaalit: [],
      kunto: "Ei tiedossa",
    },
  });

  useEffect(() => {
    if (!furnitureResult) {
      navigate(-1);
      return;
    }
  }, [furnitureResult, navigate]);

  const onSubmit = async (data: FurnitureFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const priceAnalysis = await analyzeFurniturePrice(data);
      setPriceAnalysis(priceAnalysis);
      navigate("/chatbotpage");
    } catch (error) {
      console.error("Error during form submission:", error);
      setError("Virhe lähetettäessä tietoja. Yritä uudelleen.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Palaa takaisin
        </Button>
      </div>
    );
  }

  return (
    <PageWrapper>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between relative">
            <BackButton />
            <CardTitle className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-center flex items-center justify-center gap-2">
              <PackageCheck className="h-8 w-8 text-primary" />
              Tietojen tarkistus
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <LoaderAnimation
            isLoading={isLoading}
            text="Analysoidaan tietoja..."
          />
          <Form {...form}>
            <fieldset
              disabled={form.formState.isSubmitting}
              style={{ border: "none" }}
              className={`${form.formState.isSubmitting ? "opacity-70 transition-opacity" : ""}`}
            >
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex justify-center mt-2">
                  <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-100 mb-6 w-fit">
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-700">
                          Kalusteen tunnistaminen onnistui
                        </p>
                        <p className="text-xs text-green-600">
                          Tarkista, korjaa ja hyväksy tiedot
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="merkki"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Merkki
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="malli"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Box className="h-4 w-4" />
                          Malli
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kunto"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Kunto
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Valitse kunto" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {kuntoOptions.map((kunto) => (
                                <SelectItem key={kunto} value={kunto}>
                                  {kunto}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <div className="space-y-4">
                    <FormLabel className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      Mitat
                    </FormLabel>
                    <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="mitat.pituus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              Pituus (cm)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mitat.korkeus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              Korkeus (cm)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mitat.leveys"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              Leveys (cm)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="materiaalit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Columns className="h-4 w-4" />
                          Materiaalit
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value.join(", ")}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              )
                            }
                            placeholder="Erota materiaalit pilkulla"
                            className="bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vari"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <PaintBucket className="h-4 w-4" />
                          Väri
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="bg-white"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Takaisin
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Lähetetään...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Hyväksy
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </fieldset>
          </Form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
};

export default FurniConfirmPage;
