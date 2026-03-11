import {
  ArrowsClockwise, ThumbsUp, Eye, Barbell, Wrench, Hourglass,
  Smiley, HandsClapping, CheckCircle, Fire, Sparkle, Brain,
  Rocket, Confetti, Crown, Trophy, BookOpen,
} from '@phosphor-icons/react';

const ICON_MAP = {
  ArrowsClockwise, ThumbsUp, Eye, Barbell, Wrench, Hourglass,
  Smiley, HandsClapping, CheckCircle, Fire, Sparkle, Brain,
  Rocket, Confetti, Crown, Trophy, BookOpen,
  SunglassesFill: Smiley,
};

export default function PhraseIcon({ name, size = 18, color = '#757575' }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} weight="fill" color={color} />;
}
