import { useMemo, useState } from 'react';
import { CatalogSection } from './components/CatalogSection';
import { ChatWidget } from './components/ChatWidget';
import { FlowerBarSection } from './components/FlowerBarSection';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { OrderDrawer } from './components/OrderDrawer';
import { OrderFooterSection } from './components/OrderFooterSection';
import { SupplyChainSection } from './components/SupplyChainSection';
import type {
  CatalogCategory,
  CatalogItem,
  OrderItem,
  ProductLineId,
} from './data/catalog';

export default function App() {
  const [activeLine, setActiveLine] = useState<ProductLineId>('segar');
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory>('Semua');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const totalItems = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.quantity, 0),
    [orderItems],
  );

  const handleExploreLineCatalog = (category: CatalogCategory) => {
    setSelectedCategory(category);
    const el = document.getElementById('katalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddCatalogItem = (catalogItem: CatalogItem) => {
    setOrderItems((prev) => {
      const existing = prev.find((item) => item.id === catalogItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === catalogItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: catalogItem.id,
          name: catalogItem.name,
          subtitle: `${catalogItem.category} · ${catalogItem.useCase}`,
          unitPrice: catalogItem.price,
          quantity: 1,
        },
      ];
    });
  };

  const handleAddCustomBouquet = (customItem: OrderItem) => {
    setOrderItems((prev) => [...prev, customItem]);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setOrderItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getItemQuantity = (id: string) => {
    return orderItems.find((item) => item.id === id)?.quantity ?? 0;
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#2B2625] flex flex-col">
      <Navbar
        totalItems={totalItems}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      <main className="flex-1">
        <HeroSection
          activeLine={activeLine}
          onLineChange={setActiveLine}
          onExploreLineCatalog={handleExploreLineCatalog}
        />

        <SupplyChainSection />

        <CatalogSection
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onAddCatalogItem={handleAddCatalogItem}
          getItemQuantity={getItemQuantity}
        />

        <FlowerBarSection onAddCustomBouquet={handleAddCustomBouquet} />
      </main>

      <OrderFooterSection
        orderItems={orderItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onQuickAddCatalogItem={handleAddCatalogItem}
      />

      <OrderDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderItems={orderItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <ChatWidget activeLine={activeLine} orderItems={orderItems} />
    </div>
  );
}
