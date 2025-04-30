import { planets, signs, houses, aspects } from './database';
import { QuizCategory } from '../components/CategorySelector';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  category: QuizCategory;
}

export type QuizMode = 'easy' | 'hard';

// Helper function to shuffle array elements (Fisher-Yates algorithm)
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper function to ensure consistent capitalization
const capitalizeFirstLetter = (text: string): string => {
  if (!text || text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Helper function to get unique options for a question
const getUniqueOptions = (correctAnswer: string, allPossibleIncorrectOptions: string[], count: number = 3): string[] => {
  // Filter out any incorrect options that are identical to the correct answer
  const filteredOptions = allPossibleIncorrectOptions.filter(option => option !== correctAnswer);
  
  // Get unique incorrect options
  const uniqueIncorrectOptions: string[] = [];
  const shuffledOptions = shuffleArray(filteredOptions);
  
  // Add unique incorrect options until we have the desired count or exhaust all options
  for (const option of shuffledOptions) {
    if (!uniqueIncorrectOptions.includes(option) && uniqueIncorrectOptions.length < count) {
      uniqueIncorrectOptions.push(option);
    }
    
    if (uniqueIncorrectOptions.length === count) {
      break;
    }
  }
  
  // If we don't have enough unique options, generate some filler options
  while (uniqueIncorrectOptions.length < count) {
    const fillerOption = `Option ${uniqueIncorrectOptions.length + 1}`;
    uniqueIncorrectOptions.push(fillerOption);
  }
  
  // Add the correct answer and shuffle
  const allOptions = shuffleArray([correctAnswer, ...uniqueIncorrectOptions]);
  
  // Final check to ensure we have exactly count+1 options (correct + count incorrect)
  const uniqueOptions = [...new Set(allOptions)];
  
  // If we still have duplicates and not enough options, add more filler options
  while (uniqueOptions.length < count + 1) {
    const fillerOption = `Additional Option ${uniqueOptions.length}`;
    uniqueOptions.push(fillerOption);
  }
  
  // Ensure we have exactly count+1 options
  return shuffleArray(uniqueOptions).slice(0, count + 1);
};

// Generate questions about planets
const generatePlanetQuestions = (mode: QuizMode): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  let questionId = 1;

  if (mode === 'easy') {
    // Easy mode: Use full comma-separated strings
    
    // Question about planet archetypes
    planets.forEach((planet) => {
      // Join array of archetypes for easy mode display with only first letter of entire string capitalized
      const correctAnswer = capitalizeFirstLetter(planet.archetypes.join(", "));
      
      // Generate unique incorrect options
      const otherPlanets = planets.filter(p => p.name !== planet.name);
      const incorrectOptions = otherPlanets.map(p => 
        capitalizeFirstLetter(p.archetypes.join(", "))
      );
      
      const options = getUniqueOptions(correctAnswer, incorrectOptions);
      
      // Add "the" before Sun and Moon for grammatical correctness
      const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
      
      questions.push({
        id: questionId++,
        question: `What are the archetypes of ${planetName}?`,
        options,
        correctAnswer,
        category: 'planet'
      });
    });

    // Questions about planet needs
    planets.forEach((planet) => {
      // Join array of needs for easy mode display with only first letter of entire string capitalized
      const correctAnswer = capitalizeFirstLetter(planet.needs.join(", "));
      
      // Generate unique incorrect options
      const otherPlanets = planets.filter(p => p.name !== planet.name);
      const incorrectOptions = otherPlanets.map(p => 
        capitalizeFirstLetter(p.needs.join(", "))
      );
      
      const options = getUniqueOptions(correctAnswer, incorrectOptions);
      
      // Add "the" before Sun and Moon for grammatical correctness
      const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
      
      questions.push({
        id: questionId++,
        question: `What are the needs of ${planetName}?`,
        options,
        correctAnswer,
        category: 'planet'
      });
    });

    // Questions about planet descriptors
    planets.forEach((planet) => {
      // Skip if the planet doesn't have descriptors
      if (!planet.descriptors || planet.descriptors.length === 0) return;

      // Join array of descriptors for easy mode display
      const correctAnswer = capitalizeFirstLetter(planet.descriptors.join(", "));
      
      // Generate unique incorrect options
      const otherPlanets = planets.filter(p => p.name !== planet.name && p.descriptors && p.descriptors.length > 0);
      const incorrectOptions = otherPlanets.map(p => 
        capitalizeFirstLetter(p.descriptors.join(", "))
      );
      
      const options = getUniqueOptions(correctAnswer, incorrectOptions);
      
      // Add "the" before Sun and Moon for grammatical correctness
      const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
      
      questions.push({
        id: questionId++,
        question: `What are the descriptors of ${planetName}?`,
        options,
        correctAnswer,
        category: 'planet'
      });
    });

    // Questions about planet domicile
    planets.forEach((planet) => {
      // Skip if the planet doesn't have domicile
      if (!planet.domicile || planet.domicile.length === 0) return;

      // Join array of domicile for easy mode display
      const correctAnswer = planet.domicile.join(", ");
      
      // Generate unique incorrect options
      const otherPlanets = planets.filter(p => p.name !== planet.name && p.domicile && p.domicile.length > 0);
      const incorrectOptions = otherPlanets.map(p => 
        // Ensure p.domicile exists
        p.domicile ? p.domicile.join(", ") : ""
      ).filter(option => option !== ""); // Filter out any empty strings
      
      const options = getUniqueOptions(correctAnswer, incorrectOptions);
      
      // Add "the" before Sun and Moon for grammatical correctness
      const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
      
      questions.push({
        id: questionId++,
        question: `Which sign(s) is ${planetName} in domicile?`,
        options,
        correctAnswer,
        category: 'planet'
      });
    });

    // Questions about planet exaltation
    planets.forEach((planet) => {
      // Skip if the planet doesn't have exaltation
      if (!planet.exaltation || planet.exaltation.length === 0) return;

      // Join array of exaltation for easy mode display
      const correctAnswer = planet.exaltation.join(", ");
      
      // Generate unique incorrect options
      const otherPlanets = planets.filter(p => p.name !== planet.name && p.exaltation && p.exaltation.length > 0);
      const incorrectOptions = otherPlanets.map(p => 
        // Ensure p.exaltation exists
        p.exaltation ? p.exaltation.join(", ") : ""
      ).filter(option => option !== ""); // Filter out any empty strings
      
      const options = getUniqueOptions(correctAnswer, incorrectOptions);
      
      // Add "the" before Sun and Moon for grammatical correctness
      const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
      
      questions.push({
        id: questionId++,
        question: `In which sign(s) is ${planetName} exalted?`,
        options,
        correctAnswer,
        category: 'planet'
      });
    });

    // Questions about planet detriment
    planets.forEach((planet) => {
      // Skip if the planet doesn't have detriment
      if (!planet.detriment || planet.detriment.length === 0) return;

      // Join array of detriment for easy mode display
      const correctAnswer = planet.detriment.join(", ");
       
      // Generate unique incorrect options
      const otherPlanets = planets.filter(p => p.name !== planet.name && p.detriment && p.detriment.length > 0);
      const incorrectOptions = otherPlanets.map(p => 
        // Ensure p.detriment exists
        p.detriment ? p.detriment.join(", ") : ""
      ).filter(option => option !== ""); // Filter out any empty strings
      
      const options = getUniqueOptions(correctAnswer, incorrectOptions);
      
      // Add "the" before Sun and Moon for grammatical correctness
      const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
      
      questions.push({
        id: questionId++,
        question: `In which sign(s) is ${planetName} in detriment?`,
        options,
        correctAnswer,
        category: 'planet'
      });
    });

    // Questions about planet fall
    planets.forEach((planet) => {
      // Skip if the planet doesn't have fall
      if (!planet.fall || planet.fall.length === 0) return;

      // Join array of fall for easy mode display
      const correctAnswer = planet.fall.join(", ");
      
      // Generate unique incorrect options
      const otherPlanets = planets.filter(p => p.name !== planet.name && p.fall && p.fall.length > 0);
      const incorrectOptions = otherPlanets.map(p => 
        // Ensure p.fall exists
        p.fall ? p.fall.join(", ") : ""
      ).filter(option => option !== ""); // Filter out any empty strings
      
      const options = getUniqueOptions(correctAnswer, incorrectOptions);
      
      // Add "the" before Sun and Moon for grammatical correctness
      const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
      
      questions.push({
        id: questionId++,
        question: `In which sign(s) is ${planetName} in fall?`,
        options,
        correctAnswer,
        category: 'planet'
      });
    });
  } else {
    // Hard mode: Split comma-separated strings and ask about individual items
    
    // Questions about specific planet archetypes
    planets.forEach((planet) => {
      // No need to split as archetypes is already an array
      const archetypeItems = planet.archetypes;
      const otherPlanets = planets.filter(p => p.name !== planet.name);
      
      // Get all other planets' archetype items for incorrect options
      const allOtherArchetypeItems = otherPlanets.flatMap(p => p.archetypes);
      
      // Create a question for a random archetype of this planet
      const randomArchetype = archetypeItems[Math.floor(Math.random() * archetypeItems.length)];
      
      if (randomArchetype) {
        // Ensure first letter is capitalized
        const capitalizedArchetype = capitalizeFirstLetter(randomArchetype);
        const capitalizedOptions = allOtherArchetypeItems.map(item => capitalizeFirstLetter(item));
        
        const options = getUniqueOptions(capitalizedArchetype, capitalizedOptions);
        
        // Add "the" before Sun and Moon for grammatical correctness
        const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
        
        questions.push({
          id: questionId++,
          question: `Which of these is an archetype of ${planetName}?`,
          options,
          correctAnswer: capitalizedArchetype,
          category: 'planet'
        });
      }
    });
    
    // Questions about specific planet needs
    planets.forEach((planet) => {
      // No need to split as needs is already an array
      const needItems = planet.needs;
      const otherPlanets = planets.filter(p => p.name !== planet.name);
      
      // Get all other planets' need items for incorrect options
      const allOtherNeedItems = otherPlanets.flatMap(p => p.needs);
      
      // Create a question for a random need of this planet
      const randomNeed = needItems[Math.floor(Math.random() * needItems.length)];
      
      if (randomNeed) {
        // Ensure first letter is capitalized
        const capitalizedNeed = capitalizeFirstLetter(randomNeed);
        const capitalizedOptions = allOtherNeedItems.map(item => capitalizeFirstLetter(item));
        
        const options = getUniqueOptions(capitalizedNeed, capitalizedOptions);
        
        // Add "the" before Sun and Moon for grammatical correctness
        const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
        
        questions.push({
          id: questionId++,
          question: `Which of these is a need of ${planetName}?`,
          options,
          correctAnswer: capitalizedNeed,
          category: 'planet'
        });
      }
    });

    // Questions about specific planet descriptors
    planets.forEach((planet) => {
      // Skip if the planet doesn't have descriptors
      if (!planet.descriptors || planet.descriptors.length === 0) return;
      
      const descriptorItems = planet.descriptors;
      const otherPlanets = planets.filter(p => p.name !== planet.name && p.descriptors && p.descriptors.length > 0);
      
      // Get all other planets' descriptor items for incorrect options
      const allOtherDescriptorItems = otherPlanets.flatMap(p => p.descriptors);
      
      // Create a question for a random descriptor of this planet
      const randomDescriptor = descriptorItems[Math.floor(Math.random() * descriptorItems.length)];
      
      if (randomDescriptor) {
        // Ensure first letter is capitalized
        const capitalizedDescriptor = capitalizeFirstLetter(randomDescriptor);
        const capitalizedOptions = allOtherDescriptorItems.map(item => capitalizeFirstLetter(item));
        
        const options = getUniqueOptions(capitalizedDescriptor, capitalizedOptions);
        
        // Add "the" before Sun and Moon for grammatical correctness
        const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
        
        questions.push({
          id: questionId++,
          question: `Which of these is a descriptor of ${planetName}?`,
          options,
          correctAnswer: capitalizedDescriptor,
          category: 'planet'
        });
      }
    });

    // Questions about specific planet domicile
    planets.forEach((planet) => {
      // Skip if the planet doesn't have domicile
      if (!planet.domicile || planet.domicile.length === 0) return;
      
      // Ensure we're working with a string array
      const domicileItems = planet.domicile.filter(item => item !== undefined) as string[];
      const otherPlanets = planets.filter(p => p.name !== planet.name && p.domicile && p.domicile.length > 0);
      
      // Get all other planets' domicile items for incorrect options
      const allOtherDomicileItems = otherPlanets.flatMap(p => 
        p.domicile ? p.domicile.filter(item => item !== undefined) as string[] : []
      );
      
      // Create a question for a random domicile of this planet
      const randomDomicile = domicileItems[Math.floor(Math.random() * domicileItems.length)];
      
      if (randomDomicile) {
        const options = getUniqueOptions(randomDomicile, allOtherDomicileItems);
        
        // Add "the" before Sun and Moon for grammatical correctness
        const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
        
        questions.push({
          id: questionId++,
          question: `In which sign is ${planetName} in domicile?`,
          options,
          correctAnswer: randomDomicile,
          category: 'planet'
        });
      }
    });

    // Questions about specific planet exaltation
    planets.forEach((planet) => {
      // Skip if the planet doesn't have exaltation
      if (!planet.exaltation || planet.exaltation.length === 0) return;
      
      // Ensure we're working with a string array
      const exaltationItems = planet.exaltation.filter(item => item !== undefined) as string[];
      const otherPlanets = planets.filter(p => p.name !== planet.name && p.exaltation && p.exaltation.length > 0);
      
      // Get all other planets' exaltation items for incorrect options
      const allOtherExaltationItems = otherPlanets.flatMap(p => 
        p.exaltation ? p.exaltation.filter(item => item !== undefined) as string[] : []
      );
      
      // Create a question for a random exaltation of this planet
      const randomExaltation = exaltationItems[Math.floor(Math.random() * exaltationItems.length)];
      
      if (randomExaltation) {
        const options = getUniqueOptions(randomExaltation, allOtherExaltationItems);
        
        // Add "the" before Sun and Moon for grammatical correctness
        const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
        
        questions.push({
          id: questionId++,
          question: `In which sign is ${planetName} exalted?`,
          options,
          correctAnswer: randomExaltation,
          category: 'planet'
        });
      }
    });

    // Questions about specific planet detriment
    planets.forEach((planet) => {
      // Skip if the planet doesn't have detriment
      if (!planet.detriment || planet.detriment.length === 0) return;
      
      // Ensure we're working with a string array
      const detrimentItems = planet.detriment.filter(item => item !== undefined) as string[];
      const otherPlanets = planets.filter(p => p.name !== planet.name && p.detriment && p.detriment.length > 0);
      
      // Get all other planets' detriment items for incorrect options
      const allOtherDetrimentItems = otherPlanets.flatMap(p => 
        p.detriment ? p.detriment.filter(item => item !== undefined) as string[] : []
      );
      
      // Create a question for a random detriment of this planet
      const randomDetriment = detrimentItems[Math.floor(Math.random() * detrimentItems.length)];
      
      if (randomDetriment) {
        const options = getUniqueOptions(randomDetriment, allOtherDetrimentItems);
        
        // Add "the" before Sun and Moon for grammatical correctness
        const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
        
        questions.push({
          id: questionId++,
          question: `In which sign is ${planetName} in detriment?`,
          options,
          correctAnswer: randomDetriment,
          category: 'planet'
        });
      }
    });

    // Questions about specific planet fall
    planets.forEach((planet) => {
      // Skip if the planet doesn't have fall
      if (!planet.fall || planet.fall.length === 0) return;
      
      // Ensure we're working with a string array
      const fallItems = planet.fall.filter(item => item !== undefined) as string[];
      const otherPlanets = planets.filter(p => p.name !== planet.name && p.fall && p.fall.length > 0);
      
      // Get all other planets' fall items for incorrect options
      const allOtherFallItems = otherPlanets.flatMap(p => 
        p.fall ? p.fall.filter(item => item !== undefined) as string[] : []
      );
      
      // Create a question for a random fall of this planet
      const randomFall = fallItems[Math.floor(Math.random() * fallItems.length)];
      
      if (randomFall) {
        const options = getUniqueOptions(randomFall, allOtherFallItems);
        
        // Add "the" before Sun and Moon for grammatical correctness
        const planetName = (planet.name === "Sun" || planet.name === "Moon") ? `the ${planet.name}` : planet.name;
        
        questions.push({
          id: questionId++,
          question: `In which sign is ${planetName} in fall?`,
          options,
          correctAnswer: randomFall,
          category: 'planet'
        });
      }
    });
  }

  return questions;
};

// Generate questions about signs
const generateSignQuestions = (mode: QuizMode): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  let questionId = 1000; // Start with a different ID range to avoid conflicts

  if (mode === 'easy') {
    // Easy mode: Use full comma-separated strings
    
    // Questions about sign rulers
    signs.forEach((sign) => {
      // Use first entry in domicile array as the ruler
      const correctAnswer = sign.domicile && sign.domicile[0] ? sign.domicile[0] : "Unknown";
      
      // Generate unique incorrect options from other planets
      const otherRulers = [...new Set(signs.filter(s => s.name !== sign.name && s.domicile && s.domicile[0])
        .map(s => s.domicile![0]))];
      const options = getUniqueOptions(correctAnswer, otherRulers);
      
      questions.push({
        id: questionId++,
        question: `Which planet rules the sign of ${sign.name}?`,
        options,
        correctAnswer,
        category: 'sign'
      });
    });

    // Questions about sign categories (combined polarity, element, modality)
    signs.forEach((sign) => {
      // Combine all category information for easy mode
      const correctAnswer = `${sign.polarity}, ${sign.element}, ${sign.modality}`;
      
      // Generate unique incorrect options
      const otherSigns = signs.filter(s => s.name !== sign.name);
      const incorrectOptions = otherSigns.map(s => 
        `${s.polarity}, ${s.element}, ${s.modality}`
      );
      
      const options = getUniqueOptions(correctAnswer, incorrectOptions);
      
      questions.push({
        id: questionId++,
        question: `What are the categories (polarity, element, modality) of ${sign.name}?`,
        options,
        correctAnswer,
        category: 'sign'
      });
    });

    // Questions about sign descriptors
    signs.forEach((sign) => {
      // Join array of descriptors for easy mode display with only first letter of entire string capitalized
      const correctAnswer = capitalizeFirstLetter(sign.descriptors.join(", "));
      
      // Generate unique incorrect options with only first letter of entire string capitalized
      const otherSigns = signs.filter(s => s.name !== sign.name);
      const incorrectOptions = otherSigns.map(s => 
        capitalizeFirstLetter(s.descriptors.join(", "))
      );
      
      const options = getUniqueOptions(correctAnswer, incorrectOptions);
      
      questions.push({
        id: questionId++,
        question: `What are the descriptors of ${sign.name}?`,
        options,
        correctAnswer,
        category: 'sign'
      });
    });

    // Questions about sign needs
    signs.forEach((sign) => {
      // needs is already an array
      const needItems = sign.needs.map(need => capitalizeFirstLetter(need));
        
      const otherSigns = signs.filter(s => s.name !== sign.name);
      
      // Get all other signs' need items for incorrect options with capitalization
      const allOtherNeedItems = otherSigns.flatMap(s => 
        s.needs.map(need => capitalizeFirstLetter(need))
      );
      
      // Create a question for a random need of this sign
      const randomNeed = needItems[Math.floor(Math.random() * needItems.length)];
      
      if (randomNeed) {
        const options = getUniqueOptions(randomNeed, allOtherNeedItems);
        
        questions.push({
          id: questionId++,
          question: `Which of these is a need of ${sign.name}?`,
          options,
          correctAnswer: randomNeed,
          category: 'sign'
        });
      }
    });
  } else {
    // Hard mode: Split comma-separated strings and ask about individual items
    
    // Questions about sign descriptors
    signs.forEach((sign) => {
      // No need to split as descriptors is already an array
      const descriptorItems = sign.descriptors;
      const otherSigns = signs.filter(s => s.name !== sign.name);
      
      // Get all other signs' descriptor items for incorrect options
      const allOtherDescriptorItems = otherSigns.flatMap(s => s.descriptors);
      
      // Create a question for a random descriptor of this sign
      const randomDescriptor = descriptorItems[Math.floor(Math.random() * descriptorItems.length)];
      
      if (randomDescriptor) {
        // Ensure first letter is capitalized
        const capitalizedDescriptor = capitalizeFirstLetter(randomDescriptor);
        const capitalizedOptions = allOtherDescriptorItems.map(item => capitalizeFirstLetter(item));
        
        const options = getUniqueOptions(capitalizedDescriptor, capitalizedOptions);
        
        questions.push({
          id: questionId++,
          question: `Which of these is a descriptor of ${sign.name}?`,
          options,
          correctAnswer: capitalizedDescriptor,
          category: 'sign'
        });
      }
    });
    
    // Questions about specific modality
    signs.forEach((sign) => {
      const correctAnswer = sign.modality;
      
      // For modality, there are only 3 possible values in a specific order
      const allModalities = ["Cardinal", "Fixed", "Mutable"];
      
      // Use ordered array directly instead of shuffling
      const options = allModalities;
      
      questions.push({
        id: questionId++,
        question: `What is the modality of ${sign.name}?`,
        options,
        correctAnswer,
        category: 'sign'
      });
    });
    
    // Questions about specific element
    signs.forEach((sign) => {
      const correctAnswer = sign.element;
      
      // For elements, present them in a specific order
      const allElements = ["Fire", "Earth", "Air", "Water"];
      
      // Use ordered array directly instead of shuffling
      const options = allElements;
      
      questions.push({
        id: questionId++,
        question: `What is the element of ${sign.name}?`,
        options,
        correctAnswer,
        category: 'sign'
      });
    });
    
    // Questions about specific polarity
    signs.forEach((sign) => {
      const correctAnswer = sign.polarity;
      
      // For polarity, there are only 2 possible values in a specific order
      const allPolarities = ["Diurnal", "Nocturnal"];
      
      // Use ordered array directly instead of shuffling
      const options = allPolarities;
      
      questions.push({
        id: questionId++,
        question: `What is the polarity of ${sign.name}?`,
        options,
        correctAnswer,
        category: 'sign'
      });
    });
  }

  return questions;
};

// Generate questions about houses
const generateHouseQuestions = (mode: QuizMode): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  let questionId = 2000; // Start with a different ID range to avoid conflicts

  if (mode === 'easy') {
    // Easy mode: Use full comma-separated strings
    
    // Questions about house primary topics
    houses.forEach((house) => {
      // Join primaryTopics array for easy mode display with only first letter of entire string capitalized
      const correctAnswer = capitalizeFirstLetter(house.primaryTopics.join(", "));
      
      // Generate unique incorrect options
      const otherHouses = houses.filter(h => h.number !== house.number);
      const incorrectOptions = otherHouses.map(h => 
        capitalizeFirstLetter(h.primaryTopics.join(", "))
      );
      
      const options = getUniqueOptions(correctAnswer, incorrectOptions);
      
      questions.push({
        id: questionId++,
        question: `What are the primary topics of the ${house.number}${getOrdinalSuffix(house.number)} House?`,
        options,
        correctAnswer,
        category: 'house'
      });
    });
  } else {
    // Hard mode: Split comma-separated strings and ask about individual items
    
    // Questions about specific house primary topics
    houses.forEach((house) => {
      // primaryTopics is already an array
      const topicItems = house.primaryTopics.map(item => capitalizeFirstLetter(item));
      const otherHouses = houses.filter(h => h.number !== house.number);
      
      // Get all other houses' topic items for incorrect options
      const allOtherTopicItems = otherHouses.flatMap(h => 
        h.primaryTopics.map(item => capitalizeFirstLetter(item))
      );
      
      // Create a question for a random topic of this house
      const randomTopic = topicItems[Math.floor(Math.random() * topicItems.length)];
      
      if (randomTopic) {
        const options = getUniqueOptions(randomTopic, allOtherTopicItems);
        
        questions.push({
          id: questionId++,
          question: `Which of these is a primary topic of the ${house.number}${getOrdinalSuffix(house.number)} House?`,
          options,
          correctAnswer: randomTopic,
          category: 'house'
        });
      }
    });
    
    // Questions about specific house secondary topics
    houses.forEach((house) => {
      // secondaryTopics is already an array
      const secondaryTopicItems = house.secondaryTopics.map(item => capitalizeFirstLetter(item));
      const otherHouses = houses.filter(h => h.number !== house.number);
      
      // Get all other houses' secondary topic items for incorrect options
      const allOtherSecondaryTopicItems = otherHouses.flatMap(h => 
        h.secondaryTopics.map(item => capitalizeFirstLetter(item))
      );
      
      // Create a question for a random secondary topic of this house
      const randomSecondaryTopic = secondaryTopicItems[Math.floor(Math.random() * secondaryTopicItems.length)];
      
      if (randomSecondaryTopic) {
        const options = getUniqueOptions(randomSecondaryTopic, allOtherSecondaryTopicItems);
        
        questions.push({
          id: questionId++,
          question: `Which of these is a secondary topic of the ${house.number}${getOrdinalSuffix(house.number)} House?`,
          options,
          correctAnswer: randomSecondaryTopic,
          category: 'house'
        });
      }
    });
    
    // Questions about house types with full descriptions
    houses.forEach((house) => {
      const correctAnswer = house.type;
      
      // Get representative examples of each house type (Angular, Succedent, Cadent)
      const angularExample = houses.find(h => h.type.startsWith("Angular"))?.type || "Angular";
      const succedentExample = houses.find(h => h.type.startsWith("Succedent"))?.type || "Succedent";
      const cadentExample = houses.find(h => h.type.startsWith("Cadent"))?.type || "Cadent";
      
      // Create array of exactly 3 options - one of each type
      let options = [angularExample, succedentExample, cadentExample];
      
      // If the current house type isn't in our options (shouldn't happen, but just in case),
      // replace the correct type option with the actual house type
      if (!options.includes(correctAnswer)) {
        if (correctAnswer.startsWith("Angular")) options[0] = correctAnswer;
        else if (correctAnswer.startsWith("Succedent")) options[1] = correctAnswer;
        else if (correctAnswer.startsWith("Cadent")) options[2] = correctAnswer;
      }
      
      // Don't shuffle - maintain the order Angular, Succedent, Cadent
      
      questions.push({
        id: questionId++,
        question: `What type of house is the ${house.number}${getOrdinalSuffix(house.number)} House?`,
        options,
        correctAnswer,
        category: 'house'
      });
    });
  }

  return questions;
};

// Generate questions about aspects
const generateAspectQuestions = (mode: QuizMode): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  let questionId = 3000; // Start with a different ID range to avoid conflicts

  // Filter aspects based on mode - only major aspects for easy mode
  const filteredAspects = mode === 'easy' 
    ? aspects.filter(aspect => aspect.isMajor) 
    : aspects;

  // Questions about aspect relationships
  filteredAspects.forEach((aspect) => {
    const correctAnswer = aspect.relationship;
    
    // Generate unique incorrect options - only use aspects from the filtered list for consistency
    const otherAspects = filteredAspects.filter(a => a.name !== aspect.name);
    const incorrectOptions = otherAspects.map(a => a.relationship);
    
    const options = getUniqueOptions(correctAnswer, incorrectOptions);
    
    questions.push({
      id: questionId++,
      question: `What is the relationship description of a ${aspect.name} aspect?`,
      options,
      correctAnswer,
      category: 'aspect'
    });
  });

  // Add questions about aspect degrees
  filteredAspects.forEach((aspect) => {
    const correctAnswer = `${aspect.degrees}`;
    
    // Generate unique incorrect options - only use aspects from the filtered list for consistency
    const otherAspects = filteredAspects.filter(a => a.name !== aspect.name);
    const incorrectOptions = otherAspects.map(a => `${a.degrees}`);
    
    const options = getUniqueOptions(correctAnswer, incorrectOptions);
    
    questions.push({
      id: questionId++,
      question: `How many degrees are in a ${aspect.name} aspect?`,
      options,
      correctAnswer,
      category: 'aspect'
    });
  });
  
  // Add questions about aspect shared qualities (polarity, element, modality)
  filteredAspects.forEach((aspect) => {
    // Create a formatted string of the correct qualities
    let correctQualitiesArray = [];
    if (aspect.samePolarity) correctQualitiesArray.push("Same polarity");
    if (aspect.sameElement) correctQualitiesArray.push("Same element");
    if (aspect.sameModality) correctQualitiesArray.push("Same modality");
    
    // If none are true, use a special message
    const correctAnswer = correctQualitiesArray.length > 0 
      ? correctQualitiesArray.join(", ") 
      : "No shared qualities";
    
    // Generate all possible combinations of qualities as incorrect options
    const allCombinations = [
      "Same polarity, Same element, Same modality",
      "Same polarity, Same element",
      "Same polarity, Same modality",
      "Same element, Same modality",
      "Same polarity",
      "Same element",
      "Same modality",
      "No shared qualities"
    ];
    
    // Filter out the correct answer
    const incorrectOptions = allCombinations.filter(combo => combo !== correctAnswer);
    
    // Get random options
    const options = getUniqueOptions(correctAnswer, incorrectOptions, 3);
    
    questions.push({
      id: questionId++,
      question: `Which zodiacal qualities are shared in a ${aspect.name} aspect?`,
      options,
      correctAnswer,
      category: 'aspect'
    });
  });

  if (mode === 'hard') {
    // Questions about specific aspect functions (hard mode)
    // For hard mode we use the full list of aspects including minor ones
    aspects.forEach((aspect) => {
      // aspect.function is already an array
      const functionItems = aspect.function.map(item => capitalizeFirstLetter(item));
      
      const otherAspects = aspects.filter(a => a.name !== aspect.name);
      
      // Get all other aspects' function items for incorrect options
      const allOtherFunctionItems = otherAspects.flatMap(a => 
        a.function.map(item => capitalizeFirstLetter(item))
      );
      
      // Create a question for a random function item of this aspect
      const randomFunction = functionItems[Math.floor(Math.random() * functionItems.length)];
      
      if (randomFunction) {
        const options = getUniqueOptions(randomFunction, allOtherFunctionItems);
        
        questions.push({
          id: questionId++,
          question: `Which of these is a function or keyword of a ${aspect.name} aspect?`,
          options,
          correctAnswer: randomFunction,
          category: 'aspect'
        });
      }
    });
  } else {
    // Questions about complete aspect functions (easy mode)
    // We're already using the filtered list that only includes major aspects
    filteredAspects.forEach((aspect) => {
      // Easy mode: Join the function array with commas and capitalize only the first letter
      const correctAnswer = capitalizeFirstLetter(aspect.function.join(", "));
      
      // Generate unique incorrect options
      const otherAspects = filteredAspects.filter(a => a.name !== aspect.name);
      const incorrectOptions = otherAspects.map(a => 
        capitalizeFirstLetter(a.function.join(", "))
      );
      
      const options = getUniqueOptions(correctAnswer, incorrectOptions);
      
      questions.push({
        id: questionId++,
        question: `What is the function or meaning of a ${aspect.name} aspect?`,
        options,
        correctAnswer,
        category: 'aspect'
      });
    });
  }

  return questions;
};

// Helper function to get ordinal suffix for numbers
const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
};

// Generate all questions and get a random selection based on mode and categories
export const generateQuiz = (
  questionCount: number = 10, 
  mode: QuizMode = 'easy',
  categories: QuizCategory[] = ['planet', 'sign', 'house', 'aspect']
): QuizQuestion[] => {
  // Generate questions for all categories
  const allQuestions: QuizQuestion[] = [];
  
  // Only include selected categories
  if (categories.includes('planet')) {
    allQuestions.push(...generatePlanetQuestions(mode));
  }
  
  if (categories.includes('sign')) {
    allQuestions.push(...generateSignQuestions(mode));
  }
  
  if (categories.includes('house')) {
    allQuestions.push(...generateHouseQuestions(mode));
  }
  
  if (categories.includes('aspect')) {
    allQuestions.push(...generateAspectQuestions(mode));
  }
  
  // If we don't have enough questions, adjust the count
  const actualQuestionCount = Math.min(questionCount, allQuestions.length);
  
  return shuffleArray(allQuestions).slice(0, actualQuestionCount);
}; 