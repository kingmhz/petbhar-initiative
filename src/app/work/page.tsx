'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { siteConfig, Project, MediaItem } from '@/lib/siteConfig';
import { MapPin, Users, Calendar, X, ZoomIn } from 'lucide-react';

const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
};

export default function WorkPage() {
  const [lightboxImg, setLightboxImg] = useState<{ url: string; caption?: string } | null>(null);

  // Lock body scroll when lightbox is active
  useEffect(() => {
    if (lightboxImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxImg]);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImg(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const { projects = [], media = { images: [], videos: [] } } = siteConfig;

  return (
    <main>
      {/* Page Header */}
      <section className="bg-charcoal text-ivory py-24 sm:py-32 md:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn}>
            <SectionLabel dark>OUR WORK</SectionLabel>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mt-6 sm:mt-8 leading-tight">
              On the ground.<br />Where it matters.
            </h1>
            <p className="text-lg sm:text-xl text-ivory/70 max-w-xl mt-4 sm:mt-6 font-light">
              Every drive, every meal, and every beneficiary documented with total transparency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              {projects.map((project: Project, index: number) => (
                <motion.div
                  key={project.id || index}
                  id={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group scroll-mt-28"
                >
                  <div className="relative h-72 rounded-2xl overflow-hidden mb-6 bg-beige">
                    <Image 
                      src={project.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600'} 
                      alt={project.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={80}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase text-charcoal z-10">
                      {project.status || 'Active'}
                    </div>
                  </div>
                  
                  <h3 className="font-serif text-3xl text-charcoal mb-4">{project.title}</h3>
                  <p className="text-charcoal/70 mb-6 line-clamp-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-charcoal/60">
                    {project.date && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{project.date}</span>
                      </div>
                    )}
                    {project.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location}</span>
                      </div>
                    )}
                    {project.beneficiaries && (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{project.beneficiaries} Beneficiaries</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div {...fadeIn} className="text-center py-20 bg-beige/30 rounded-2xl border border-charcoal/5">
              <p className="text-charcoal/60 text-lg">Projects coming soon. We&apos;re preparing our first initiatives.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Media Gallery */}
      <section className="bg-beige/50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="mb-16">
            <SectionLabel>GALLERY</SectionLabel>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal mt-6">
              Our Work in Pictures & Videos
            </h2>
          </motion.div>
          
          {(media.images?.filter((img: MediaItem) => Boolean(img?.url?.trim())).length > 0 || media.videos?.length > 0) ? (
            <div className="space-y-12">
              {media.images?.filter((img: MediaItem) => Boolean(img?.url?.trim())).length > 0 && (
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-warm-grey mb-6">Field Documentation & Photos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {media.images.filter((img: MediaItem) => Boolean(img?.url?.trim())).map((img: MediaItem, i: number) => (
                      <motion.div 
                        key={img.id || i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setLightboxImg(img)}
                        className="aspect-[4/3] rounded-xl overflow-hidden relative group bg-ivory shadow-sm border border-charcoal/5 cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-charcoal/50"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLightboxImg(img); }}
                        aria-label={img.caption || 'View full image'}
                      >
                        <Image 
                          src={img.url} 
                          alt={img.caption || 'Gallery photo'} 
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          quality={85}
                          unoptimized={!img.url.includes('images.unsplash.com')}
                          className="object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        {/* Mobile & desktop tap/hover indicator */}
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white p-1.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity z-10">
                          <ZoomIn className="w-3.5 h-3.5" />
                        </div>
                        {img.caption && (
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 z-10">
                            <p className="text-white text-sm line-clamp-2">{img.caption}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {media.videos?.length > 0 && (
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-warm-grey mb-6">Action & Video Updates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {media.videos.map((vid: MediaItem, i: number) => {
                      const embedUrl = getYouTubeEmbedUrl(vid.url);
                      const isYouTube = Boolean(embedUrl);

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="rounded-2xl overflow-hidden bg-white border border-charcoal/5 shadow-sm p-4"
                        >
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                            {isYouTube ? (
                              <iframe
                                src={embedUrl || undefined}
                                title={vid.caption || 'PetBhar video'}
                                className="w-full h-full border-0"
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <video src={vid.url} controls className="w-full h-full object-cover" />
                            )}
                          </div>
                          {vid.caption && (
                            <div className="mt-3 px-1">
                              <p className="font-medium text-charcoal text-sm">{vid.caption}</p>
                              {vid.date && <p className="text-xs text-warm-grey mt-0.5">{vid.date}</p>}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <motion.div {...fadeIn} className="text-center py-20 bg-ivory/50 rounded-2xl border border-charcoal/5">
              <p className="text-charcoal/60 text-lg">Gallery coming soon. Photos and videos from our work will appear here.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Mobile Touch Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImg(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 select-none"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button with high-contrast target for fingers */}
            <button
              onClick={() => setLightboxImg(null)}
              aria-label="Close photo view"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 active:scale-95 transition-all z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
            >
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[72vh] rounded-2xl overflow-hidden bg-black/40 shadow-2xl border border-white/10">
                <Image
                  src={lightboxImg.url}
                  alt={lightboxImg.caption || 'Field photo full view'}
                  fill
                  sizes="100vw"
                  quality={90}
                  unoptimized={!lightboxImg.url.includes('images.unsplash.com')}
                  className="object-contain"
                  priority
                />
              </div>

              {lightboxImg.caption && (
                <div className="mt-4 text-center max-w-xl px-4">
                  <p className="text-white/90 text-sm sm:text-base font-light leading-relaxed">
                    {lightboxImg.caption}
                  </p>
                </div>
              )}

              <p className="text-white/40 text-xs mt-3 uppercase tracking-wider">
                Tap anywhere or press close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
