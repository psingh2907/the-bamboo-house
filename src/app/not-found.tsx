import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="404"
      title={
        <>
          This table is <em className="text-bamboo">empty</em>.
        </>
      }
      intro="The page you were looking for isn't here. The food, happily, still is."
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/">Back to home</Button>
        <Button href="/menu" variant="outline" icon="book">
          See the menu
        </Button>
      </div>
    </PageHero>
  );
}
