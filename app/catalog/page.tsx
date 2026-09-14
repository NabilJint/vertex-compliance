import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { ProgramCard } from "@/components/training/program-card"
import { getAllTrainingPrograms } from "@/lib/sanity"

export default async function CatalogPage() {
  const programs = await getAllTrainingPrograms()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6">
            <h1 className="mb-8 text-[32px] font-bold" style={{ color: "#111827" }}>Catalog</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <ProgramCard key={program._id} program={program} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
