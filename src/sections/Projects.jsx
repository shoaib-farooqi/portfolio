import { ArrowUpRight, Github } from "lucide-react";
import { AnimatedBorderButton } from "@/components/AnimatedBorderButton";
const projects = [
  {
    title: "AI Talking Agent",
    description:
      "KenTalk is an enterprise-grade AI voice assistant that enables intelligent, multilingual, and context-aware voice interactions across business systems like ERP, CRM, and BI tools.",
    image: "/projects/portfolio-kentalk.png",
    tags: ["React", "SCSS", "Tailwind", "GSAP"],
    link: "https://kentalk-vercel.vercel.app/",
    github: "https://github.com/shoaib-farooqi/kentalk-vercel",
  },
  {
    title: "Search GPT",
    description:
      "A ChatGPT clone developed with the MERN stack that provides fast, AI-powered conversational responses in a user-friendly interface.",
    image: "/projects/portfolio-GPT.png",
    tags: ["React.js", "Express", "MongoDB", "Node.js"],
    link: "http://ec2-54-234-95-0.compute-1.amazonaws.com/",
    github: "https://github.com/shoaib-farooqi/Search-gpt-backend",
  },
  {
    title: "E-Commerce Platform",
    description:
      "A mini e-commerce frontend built with Next.js and TypeScript featuring SSR, dynamic routing, and external API integration.",
    image: "/projects/portfolio-Ecomm.png",
    tags: ["Next.js", "Typescript", "Tailwincss",],
    link: "https://github.com/shoaib-farooqi/mini-e-comm",
    github: "https://github.com/shoaib-farooqi/mini-e-comm",
  },
  {
    title: "Project Management Tool",
    description:
      "A Zomato-inspired food discovery platform built with the MERN stack, featuring a Reels-style vertical video feed for exploring restaurants and dishes.",
    image: "/projects/portfolio-zomato.png",
    tags: ["MongoDB", "Express", "Node.js", "React"],
    link: "https://github.com/shoaib-farooqi/zomato-reels-clone",
    github: "https://github.com/shoaib-farooqi/zomato-reels-clone",
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      {/* Bg glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mx-auto max-w-3xl mb-16">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            Featured Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
            Projects that
            <span className="font-serif italic font-normal text-white">
              {" "}
              make an impact.
            </span>
          </h2>
          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            A selection of my recent work, from complex web applications to
            innovative tools that solve real-world problems.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="group glass rounded-2xl overflow-hidden animate-fade-in md:row-span-1"
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 
                bg-gradient-to-t from-card via-card/50
                 to-transparent opacity-60"
                />
                {/* Overlay Links */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={project.link}
                    className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                  <a
                    href={project.github}
                    className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <ArrowUpRight
                    className="w-5 h-5 
                  text-muted-foreground group-hover:text-primary
                   group-hover:translate-x-1 
                   group-hover:-translate-y-1 transition-all"
                  />
                </div>
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="px-4 py-1.5 rounded-full bg-surface text-xs font-medium border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12 animate-fade-in animation-delay-500">
          <AnimatedBorderButton>
            View All Projects
            <ArrowUpRight className="w-5 h-5" />
          </AnimatedBorderButton>
        </div>
      </div>
    </section>
  );
};
