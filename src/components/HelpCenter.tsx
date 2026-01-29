/**
 * Help Center Component - Miraflores Plus
 * 
 * Centro de ayuda con búsqueda de artículos
 */

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import {
  Search,
  BookOpen,
  MessageCircleQuestion,
  Lightbulb,
  FileText,
  X,
  ChevronRight,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { 
  HELP_ARTICLES, 
  getCategories, 
  getArticlesByCategory,
  searchHelpArticles,
  useOnboarding,
} from '../utils/onboarding';
import { analytics } from '../utils/analytics';

interface HelpCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: string;
}

export function HelpCenter({ open, onOpenChange, defaultCategory }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    defaultCategory || null
  );
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const { markHelpArticleViewed, hasViewedHelpArticle } = useOnboarding();

  const categories = useMemo(() => getCategories(), []);

  const filteredArticles = useMemo(() => {
    if (searchQuery.trim()) {
      return searchHelpArticles(searchQuery);
    }
    if (selectedCategory) {
      return getArticlesByCategory(selectedCategory);
    }
    return HELP_ARTICLES;
  }, [searchQuery, selectedCategory]);

  const selectedArticle = useMemo(() => {
    if (selectedArticleId) {
      return HELP_ARTICLES.find((a) => a.id === selectedArticleId);
    }
    return null;
  }, [selectedArticleId]);

  const handleArticleClick = (articleId: string) => {
    setSelectedArticleId(articleId);
    markHelpArticleViewed(articleId);
    analytics.event('help_article_viewed', 'help', articleId);
  };

  const handleBack = () => {
    setSelectedArticleId(null);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    analytics.event('help_category_selected', 'help', category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
    if (query.trim()) {
      analytics.event('help_search', 'help', query);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0" aria-describedby="help-center-description">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl">Centro de Ayuda</DialogTitle>
          <DialogDescription id="help-center-description" className="text-sm text-gray-500">
            Encuentra respuestas a tus preguntas
          </DialogDescription>
        </DialogHeader>
        
        {/* Header Row with Icon and Close Button */}
        <div className="flex items-center justify-between px-6 -mt-12 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0477BF] to-[#2BB9D9] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar artículos de ayuda..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSearch('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Quick filters */}
          {!searchQuery && !selectedCategory && (
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="cursor-pointer hover:bg-[#0477BF]/10 hover:border-[#0477BF]"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {selectedCategory && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-gray-500">Categoría:</span>
              <Badge variant="default" className="bg-[#0477BF]">
                {selectedCategory}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="h-6 px-2 text-xs"
              >
                Limpiar
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 px-6 py-4" style={{ maxHeight: 'calc(85vh - 220px)' }}>
          {selectedArticle ? (
            // Article view
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mb-2"
              >
                <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                Volver a artículos
              </Button>

              <div>
                <Badge variant="outline" className="mb-3">
                  {selectedArticle.category}
                </Badge>
                <h2 className="text-2xl font-semibold text-[#0477BF] mb-4">
                  {selectedArticle.title}
                </h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedArticle.content}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                  <span className="text-xs text-gray-500">Etiquetas:</span>
                  {selectedArticle.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs bg-gray-50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Related articles */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Artículos relacionados
                  </h3>
                  <div className="space-y-2">
                    {getArticlesByCategory(selectedArticle.category)
                      .filter((a) => a.id !== selectedArticle.id)
                      .slice(0, 3)
                      .map((article) => (
                        <button
                          key={article.id}
                          onClick={() => handleArticleClick(article.id)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-[#0477BF] hover:underline">
                            {article.title}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Articles list
            <div className="space-y-4">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircleQuestion className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No se encontraron artículos para "{searchQuery}"
                  </p>
                  <Button
                    variant="link"
                    onClick={() => handleSearch('')}
                    className="mt-2"
                  >
                    Limpiar búsqueda
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">
                    {filteredArticles.length} artículo
                    {filteredArticles.length !== 1 ? 's' : ''} encontrado
                    {filteredArticles.length !== 1 ? 's' : ''}
                  </p>

                  {/* Group by category */}
                  <Accordion type="multiple" className="space-y-2">
                    {categories.map((category) => {
                      const categoryArticles = filteredArticles.filter(
                        (a) => a.category === category
                      );

                      if (categoryArticles.length === 0) return null;

                      return (
                        <AccordionItem
                          key={category}
                          value={category}
                          className="border rounded-lg"
                        >
                          <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-[#0477BF]/10 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-[#0477BF]" />
                              </div>
                              <div className="text-left">
                                <h3 className="font-medium">{category}</h3>
                                <p className="text-xs text-gray-500">
                                  {categoryArticles.length} artículo
                                  {categoryArticles.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-2">
                              {categoryArticles.map((article) => (
                                <button
                                  key={article.id}
                                  onClick={() => handleArticleClick(article.id)}
                                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-[#0477BF]/20"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <h4 className="text-sm font-medium text-[#0477BF] mb-1">
                                        {article.title}
                                      </h4>
                                      <p className="text-xs text-gray-600 line-clamp-2">
                                        {article.content}
                                      </p>
                                    </div>
                                    {hasViewedHelpArticle(article.id) && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-green-50 text-green-700 border-green-200"
                                      >
                                        Visto
                                      </Badge>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lightbulb className="w-4 h-4" />
              <span>¿No encontraste lo que buscabas?</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                analytics.event('help_contact_support', 'help');
                window.open('mailto:soporte@mirafloresplus.com', '_blank');
              }}
            >
              <Mail className="w-4 h-4" />
              Contactar Soporte
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Help Center Button
 */
interface HelpCenterButtonProps {
  onClick: () => void;
}

export function HelpCenterButton({ onClick }: HelpCenterButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="gap-2"
      aria-label="Centro de Ayuda"
    >
      <MessageCircleQuestion className="w-4 h-4" />
      <span className="hidden sm:inline">Ayuda</span>
    </Button>
  );
}
