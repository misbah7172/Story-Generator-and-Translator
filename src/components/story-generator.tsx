
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateStory } from "@/ai/flows/generate-story";
import { translateStory } from "@/ai/flows/translate-story-flow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Download, AlertCircle, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const storyFormSchema = z.object({
  prompt: z.string().min(1, "Please enter a word or phrase.").max(100, "Prompt is too long (max 100 characters)."),
});

type StoryFormValues = z.infer<typeof storyFormSchema>;

const LANGUAGES = [
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Japanese", label: "Japanese" },
  { value: "Chinese (Simplified)", label: "Chinese (Simplified)" },
  { value: "Hindi", label: "Hindi" },
  { value: "Bangla", label: "Bangla" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Russian", label: "Russian" },
  { value: "Arabic", label: "Arabic" },
];

export function StoryGenerator() {
  const [story, setStory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [translatedStory, setTranslatedStory] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(LANGUAGES[0].value);

  const { toast } = useToast();

  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(data: StoryFormValues) {
    setIsLoading(true);
    setStory(null);
    setError(null);
    setTranslatedStory(null);
    setTranslationError(null);

    try {
      const result = await generateStory({ inputWord: data.prompt });
      if (result.story) {
        setStory(result.story);
      } else {
        setError("The AI couldn't weave a story this time. Try a different word!");
        toast({
          title: "Story Generation Failed",
          description: "The AI couldn't weave a story. Please try again.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Error generating story:", e);
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(`Failed to generate story: ${errorMessage}`);
      toast({
        title: "Error Generating Story",
        description: `Failed to generate story: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveStory = (content: string, baseFilename: string) => {
    if (!content) return;
    try {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${baseFilename}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Story Saved!",
        description: `Your story has been downloaded as ${baseFilename}.txt.`,
      });
    } catch (e) {
        console.error("Error saving story:", e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during save.";
        toast({
            title: "Save Error",
            description: `Failed to save story: ${errorMessage}`,
            variant: "destructive",
        });
    }
  };

  const handleTranslateStory = async () => {
    if (!story) return;

    setIsTranslating(true);
    setTranslatedStory(null);
    setTranslationError(null);

    try {
      const result = await translateStory({ textToTranslate: story, targetLanguage: selectedLanguage });
      if (result.translatedText) {
        setTranslatedStory(result.translatedText);
        toast({
          title: "Story Translated!",
          description: `Story successfully translated to ${selectedLanguage}.`,
        });
      } else {
        setTranslationError("The AI couldn't translate the story this time. Try again or a different language.");
        toast({
          title: "Translation Failed",
          description: "The AI couldn't translate the story.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Error translating story:", e);
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setTranslationError(`Failed to translate story: ${errorMessage}`);
      toast({
        title: "Error Translating Story",
        description: `Failed to translate story: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full shadow-xl bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Craft Your Tale</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter a word or phrase, and let the magic begin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Your Magical Word</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., enchanted forest, whispering moon, brave knight"
                        {...field}
                        className="text-base"
                        disabled={isLoading || isTranslating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-6" disabled={isLoading || isTranslating}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Weaving Your Story...
                  </>
                ) : (
                  "Generate Story"
                )}
              </Button>
            </form>
          </Form>

          {error && (
            <div className="mt-6 p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/30 flex items-start animate-fadeIn">
              <AlertCircle className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
              <div>
                  <p className="font-semibold">Oops! Something went wrong with generation.</p>
                  <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {story && !isLoading && (
        <Card className="animate-fadeIn bg-background border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Your Woven Tale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap leading-relaxed text-foreground/90 text-lg">
              {story}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleSaveStory(story, "word_weaver_story_original")}
              variant="outline"
              className="w-full sm:w-auto"
              disabled={isTranslating}
            >
              <Download className="mr-2 h-4 w-4" />
              Save Original Story
            </Button>
          </CardFooter>
        </Card>
      )}

      {story && !isLoading && (
        <Card className="animate-fadeIn bg-card text-card-foreground shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Languages className="mr-2 h-6 w-6 text-primary" />
              Translate Your Tale
            </CardTitle>
            <CardDescription>
              Choose a language and translate your story.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
                disabled={isTranslating}
              >
                <SelectTrigger className="w-full sm:w-[200px] text-base">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className="text-base">
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleTranslateStory}
                className="w-full sm:w-auto text-lg py-3"
                disabled={isTranslating || !story}
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Translating...
                  </>
                ) : (
                  "Translate"
                )}
              </Button>
            </div>
            {translationError && (
              <div className="mt-4 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/30 flex items-start animate-fadeIn">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="font-semibold">Translation Failed</p>
                    <p className="text-sm">{translationError}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {translatedStory && !isTranslating && (
        <Card className="animate-fadeIn bg-background border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">
              Translated Tale ({LANGUAGES.find(l => l.value === selectedLanguage)?.label})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap leading-relaxed text-foreground/90 text-lg">
              {translatedStory}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleSaveStory(translatedStory, `word_weaver_story_${selectedLanguage.toLowerCase().replace(/\s/g, '_')}`)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Save Translated Story
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

