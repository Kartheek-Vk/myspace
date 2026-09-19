import React from 'react';
import { Code2 } from 'lucide-react';
import { CategoryPage } from './CategoryPage';
export const BtechPage: React.FC = () => <CategoryPage category="BTECH" icon={Code2} description="College subjects, assignments and coursework." />;
export const DsaPage: React.FC = () => <CategoryPage category="DSA" icon={Code2} description="Data structures, algorithms and problem solving." />;
