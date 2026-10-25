import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <h1 className="font-display text-6xl uppercase text-ecm-navy">Page not found</h1>
      <p className="mt-4 text-gray-600">Sorry, we could not find that page.</p>
      <ButtonLink href="/" className="mt-8">Back to home</ButtonLink>
    </Container>
  );
}
