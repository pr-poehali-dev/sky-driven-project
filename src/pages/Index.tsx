import { StarField } from "@/components/StarField"
import { ChevronDown } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import MusicPlayer from "@/components/MusicPlayer"

export default function Index() {
  const [isHeadingVisible, setIsHeadingVisible] = useState(false)
  const [isAboutVisible, setIsAboutVisible] = useState(false)
  const [isServicesVisible, setIsServicesVisible] = useState(false)
  const [isServicesTitleVisible, setIsServicesTitleVisible] = useState(false)
  const [blurAmount, setBlurAmount] = useState(0)
  const [initialHeight, setInitialHeight] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const aboutSectionRef = useRef<HTMLElement>(null)
  const aboutContentRef = useRef<HTMLDivElement>(null)
  const servicesSectionRef = useRef<HTMLElement>(null)
  const servicesContentRef = useRef<HTMLDivElement>(null)
  const servicesTitleRef = useRef<HTMLHeadingElement>(null)
  const contactSectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    if (initialHeight === 0) {
      setInitialHeight(window.innerHeight)
    }
  }, [initialHeight])

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const maxBlur = 8
          const triggerHeight = initialHeight * 1.2
          const newBlurAmount = Math.min(maxBlur, (scrollRef.current / triggerHeight) * maxBlur)
          setBlurAmount(newBlurAmount)
          ticking.current = false
        })
        ticking.current = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [initialHeight])

  useEffect(() => {
    const headingObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsHeadingVisible(true); headingObserver.unobserve(entry.target) }
    }, { threshold: 0.1 })
    if (headingRef.current) headingObserver.observe(headingRef.current)

    const aboutObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsAboutVisible(true); aboutObserver.unobserve(entry.target) }
    }, { threshold: 0.1 })
    if (aboutContentRef.current) aboutObserver.observe(aboutContentRef.current)

    const servicesObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsServicesVisible(true); servicesObserver.unobserve(entry.target) }
    }, { threshold: 0.1 })
    if (servicesContentRef.current) servicesObserver.observe(servicesContentRef.current)

    const servicesTitleObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsServicesTitleVisible(true); servicesTitleObserver.unobserve(entry.target) }
    }, { threshold: 0.1 })
    if (servicesTitleRef.current) servicesTitleObserver.observe(servicesTitleRef.current)

    return () => {
      if (headingRef.current) headingObserver.unobserve(headingRef.current)
      if (aboutContentRef.current) aboutObserver.unobserve(aboutContentRef.current)
      if (servicesContentRef.current) servicesObserver.unobserve(servicesContentRef.current)
      if (servicesTitleRef.current) servicesTitleObserver.unobserve(servicesTitleRef.current)
    }
  }, [])

  const scaleFactor = 1 + blurAmount / 16
  const warpSpeedStyle = { transform: `scale(${scaleFactor})`, transition: "transform 0.2s ease-out" }
  const heroStyle = { height: initialHeight ? `${initialHeight}px` : "100vh" }

  const scrollToAbout = () => aboutSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  const scrollToContact = () => contactSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  const scrollToMusic = () => servicesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

  const tracks = [
    {
      title: "Беспонтовый пирожок",
      artist: "Гражданская оборона",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-black" style={heroStyle}>
        {/* Nav top right */}
        <div className="absolute top-6 right-6 z-10 flex space-x-3">
          <a
            href="https://vk.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ВКонтакте"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white bg-transparent text-white transition-colors hover:bg-white hover:text-black"
          >
            <Icon name="Music2" size={18} />
          </a>
          <Button
            onClick={scrollToContact}
            variant="outline"
            size="sm"
            className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors"
          >
            Контакты
          </Button>
        </div>

        <div className="absolute inset-0" style={warpSpeedStyle}>
          <StarField blurAmount={blurAmount} />
        </div>

        {/* Hero photo overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://cdn.poehali.dev/projects/11ad4c8a-3391-40ed-8042-618d771a68ec/files/c448153e-4677-425b-b568-a4c6c08cc16c.jpg)`,
            opacity: 0.35,
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div
              className="backdrop-blur-sm px-8 py-6 rounded-2xl inline-block relative"
              style={{
                background: "radial-gradient(circle, rgba(80,0,120,0.7) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.2) 100%)",
              }}
            >
              <p className="text-purple-300 text-sm tracking-[0.3em] uppercase mb-2 font-light">Официальный сайт</p>
              <h1 className="text-5xl font-bold text-white md:text-7xl font-heading tracking-wide">
                Румиля{" "}
                <span role="img" aria-label="mic">🎤</span>
              </h1>
              <p className="mt-4 text-lg text-gray-300 md:text-xl px-4 max-w-xs mx-auto md:max-w-none">
                Музыка, которая касается души
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                <Button
                  onClick={scrollToMusic}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-500 text-white border-0 px-6"
                >
                  <Icon name="Play" size={16} className="mr-2" />
                  Слушать онлайн
                </Button>
                <Button
                  onClick={scrollToAbout}
                  variant="outline"
                  size="sm"
                  className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors"
                >
                  О певице
                </Button>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-20 animate-bounce cursor-pointer"
            onClick={scrollToAbout}
            role="button"
            aria-label="Узнать больше"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") scrollToAbout() }}
          >
            <ChevronDown className="h-8 w-8 text-white" />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section ref={aboutSectionRef} id="about" className="py-20 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div
            ref={aboutContentRef}
            className={cn(
              "max-w-4xl mx-auto transition-all duration-1000 ease-out",
              isAboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-purple-500 flex-shrink-0 shadow-[0_0_40px_rgba(147,51,234,0.5)]">
                <img
                  src="https://cdn.poehali.dev/projects/11ad4c8a-3391-40ed-8042-618d771a68ec/files/c3814b71-4801-4f3c-8404-46c5d3e8d71f.jpg"
                  alt="Румиля — певица"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4 text-center md:text-left px-4 md:px-0">
                <p className="text-purple-400 text-sm tracking-widest uppercase">Биография</p>
                <h2 className="text-3xl font-bold font-heading">О певице</h2>
                <div className="space-y-4 max-w-2xl">
                  <p className="text-gray-300">
                    Румиля — самобытная исполнительница с неповторимым голосом и особым взглядом на мир. 
                    Её музыка соединяет живые эмоции и искренние слова, которые находят отклик в сердцах слушателей.
                  </p>
                  <p className="text-gray-300">
                    Вдохновляясь легендами отечественной рок-музыки, Румиля создаёт свой уникальный стиль — 
                    честный, страстный и живой. Каждая песня — это история из жизни.
                  </p>
                  <p className="text-gray-300">
                    Выступает на сценах по всей стране, покоряя публику своей энергетикой и харизмой.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center md:justify-start">
                  <Button
                    onClick={scrollToContact}
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors w-[160px] mx-auto sm:mx-0"
                  >
                    Написать
                  </Button>
                  <Button
                    onClick={scrollToMusic}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-500 text-white border-0 w-[160px] mx-auto sm:mx-0"
                  >
                    <Icon name="Headphones" size={16} className="mr-2" />
                    Слушать
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY SECTION */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold font-heading text-white">Фотогалерея</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <div className="rounded-xl overflow-hidden aspect-square shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] transition-shadow duration-300">
              <img
                src="https://cdn.poehali.dev/projects/11ad4c8a-3391-40ed-8042-618d771a68ec/files/c3814b71-4801-4f3c-8404-46c5d3e8d71f.jpg"
                alt="Румиля — портрет"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-xl overflow-hidden aspect-square shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] transition-shadow duration-300">
              <img
                src="https://cdn.poehali.dev/projects/11ad4c8a-3391-40ed-8042-618d771a68ec/files/c254bc4c-4a7b-4034-8c25-065116531286.jpg"
                alt="Румиля на сцене"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-xl overflow-hidden aspect-square shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] transition-shadow duration-300">
              <img
                src="https://cdn.poehali.dev/projects/11ad4c8a-3391-40ed-8042-618d771a68ec/files/c448153e-4677-425b-b568-a4c6c08cc16c.jpg"
                alt="Румиля — концерт"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MUSIC SECTION */}
      <section ref={servicesSectionRef} id="music" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2
            ref={servicesTitleRef}
            className={cn(
              "mb-4 text-center text-3xl font-bold font-heading transition-all duration-1000 ease-out",
              isServicesTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            Слушать онлайн
          </h2>
          <p className={cn(
            "text-center text-gray-400 mb-12 transition-all duration-1000 ease-out",
            isServicesTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          )}>
            Треки в открытом доступе
          </p>
          <div
            ref={servicesContentRef}
            className={cn(
              "max-w-2xl mx-auto transition-all duration-1000 ease-out",
              isServicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            <MusicPlayer tracks={tracks} />

            <div className="mt-8 grid grid-cols-1 gap-4">
              <div className="bg-gray-800 rounded-lg p-5 flex items-center gap-4 hover:bg-gray-700 transition-colors">
                <div className="w-14 h-14 rounded-lg bg-purple-700 flex items-center justify-center flex-shrink-0">
                  <Icon name="Music" size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Беспонтовый пирожок</p>
                  <p className="text-sm text-gray-400">Гражданская оборона</p>
                </div>
                <Icon name="Play" size={20} className="text-purple-400" />
              </div>
            </div>

            <div className="mt-10 flex justify-center gap-4">
              <a
                href="https://music.yandex.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                <Icon name="Music2" size={18} />
                Яндекс Музыка
              </a>
              <a
                href="https://vk.com/music"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                <Icon name="Music" size={18} />
                ВКонтакте
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section ref={contactSectionRef} id="contact" className="bg-gradient-to-b from-gray-900 to-black py-16">
        <div className="container mx-auto px-4">
          <h2
            ref={headingRef}
            className={cn(
              "mb-4 text-center text-3xl font-bold font-heading text-white transition-all duration-1000 ease-out",
              isHeadingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            Написать Румиле
          </h2>
          <p className="text-center text-gray-400 mb-10">Для сотрудничества, концертов и предложений</p>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}