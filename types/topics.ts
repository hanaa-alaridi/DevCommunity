export interface TopicSelectorProps {
  availableTopics: string[];
  selectedTopics: string[];
  onChange: (topics: string[]) => void;
  maxTopics?: number;
}