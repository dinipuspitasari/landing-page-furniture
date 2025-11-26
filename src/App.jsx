import Header from "./components/Header";
import AppFooter from "./components/AppFooter";
import Hero from "./home/Hero";
import BestSeller from "./home/BestSeller";
import CreatingStyle from "./home/CreatingStye";
import Categories from "./home/Categories";
import CreateYourOwn from "./home/CreateYourOwn";

export default function App() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-start py-6">
        <div className="w-full max-w-6xl">
          <Header />
          <Hero />
          <BestSeller />
          <CreatingStyle/>
          <Categories />
          <CreateYourOwn />
          <AppFooter />
        </div>
      </div>
    </>
  );
}
