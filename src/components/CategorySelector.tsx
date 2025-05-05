export type QuizCategory = 'planet' | 'sign' | 'house' | 'aspect';

interface CategorySelectorProps {
  selectedCategories: QuizCategory[];
  onCategoriesChange: (categories: QuizCategory[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  selectedCategories, 
  onCategoriesChange 
}) => {
  const categories: QuizCategory[] = ['planet', 'sign', 'house', 'aspect'];
  
  const toggleCategory = (category: QuizCategory) => {
    if (selectedCategories.includes(category)) {
      // Don't allow deselecting if it's the last category
      if (selectedCategories.length > 1) {
        onCategoriesChange(selectedCategories.filter(c => c !== category));
      }
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const getCategoryLabel = (category: QuizCategory): string => {
    switch (category) {
      case 'planet': return 'Planets';
      case 'sign': return 'Signs';
      case 'house': return 'Houses';
      case 'aspect': return 'Aspects';
    }
  };

  const getCategoryIcon = (category: QuizCategory): string => {
    switch (category) {
      case 'planet': return '🪐';
      case 'sign': return '♊';
      case 'house': return '🏠';
      case 'aspect': return '🔄';
    }
  };
  
  return (
    <div className="category-selector">
      <div className="category-options">
        {categories.map(category => (
          <button
            key={category}
            className={`category-button ${selectedCategories.includes(category) ? 'active' : ''}`}
            onClick={() => toggleCategory(category)}
            aria-pressed={selectedCategories.includes(category)}
            disabled={selectedCategories.length === 1 && selectedCategories.includes(category)}
          >
            <span className="category-icon">{getCategoryIcon(category)}</span>
            <span className="category-label">{getCategoryLabel(category)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector; 