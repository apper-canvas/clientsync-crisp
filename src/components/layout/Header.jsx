import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import ApperIcon from '../ApperIcon';

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search contacts, deals, activities..."
            className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <ApperIcon name="Bell" className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <ApperIcon name={theme === 'dark' ? 'Sun' : 'Moon'} className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <ApperIcon name="Settings" className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;