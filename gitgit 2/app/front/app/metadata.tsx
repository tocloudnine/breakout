import { Button } from "@/components/ui/button";

export default function Metadata() {
  return (
    <div className="w-full p-8 pt-16 space-y-14">
      {/* Step 1: MetaData */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-5xl">MetaData</h2>
          <div className="text-right">
            <div className="text-sm text-cyberdeus-light-gray">STEP 2/3</div>
          </div>
        </div>

        <div className="flex space-x-1 mb-4">
          <div className="w-5 h-[5px] bg-white/20"></div>
          <div className="w-5 h-[5px] bg-white"></div>
          <div className="w-[5px] h-[5px] bg-white/20"></div>
        </div>

        <div className="border-t border-cyberdeus-gray pt-3 mb-2">
          <div className="flex justify-between items-center">
            <p className="text-2xl">Required</p>
            <span className="text-white/50 text-base">01</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="bg-cyberdeus-dark p-4 flex-grow">
              <span>Title</span>
            </div>
            <Button variant="default" className="bg-purple-card hover:bg-purple-card h-full ml-2 px-4 rounded-none text-black font-bold">
              {"<>"}
            </Button>
          </div>

          <div className="bg-cyberdeus-dark p-4 w-full">
            <span>Caption</span>
          </div>

          <div className="flex">
            <div className="bg-cyberdeus-dark p-4 flex-grow">
              <span>Starting Price</span>
            </div>
            <div className="flex">
              <Button variant="default" className="bg-purple-card hover:bg-purple-card h-full px-4 py-4 rounded-none text-white">
                Auction
              </Button>
              <Button variant="default" className="bg-transparent hover-purple-card h-full px-4 py-4 rounded-none text-white border border-white/10">
                Fixed
              </Button>
            </div>
          </div>

          <div className="bg-cyberdeus-dark p-4 w-full flex justify-between items-center">
            <span>Editions</span>
            <span className="text-white">&gt;</span>
          </div>

          <div className="bg-cyberdeus-dark p-4 w-full flex justify-between items-center">
            <span>Network</span>
            <span className="text-white">&gt;</span>
          </div>
        </div>
      </div>

      {/* Step 2: Royalty Settings */}
      <div className="space-y-3">
        <div className="border-t border-cyberdeus-gray pt-3 mb-2">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl">Royalty Settings</h2>
            <span className="text-white/50 text-base">02</span>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span>Digital Resell</span>
              <span className="text-white">5%</span>
            </div>
            <div className="h-1 w-full bg-cyberdeus-progress rounded-none overflow-hidden">
              <div className="h-full bg-purple-card relative" style={{ width: '25%' }}>
                <div className="absolute w-2 h-6 bg-purple-card top-[-10px] right-0"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-cyberdeus-gray mt-1">
              <span>0</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
              <span>50</span>
              <span>60</span>
              <span>70</span>
              <span>80</span>
              <span>90</span>
              <span>100</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>Physical Merchandising</span>
              <span className="text-white">18%</span>
            </div>
            <div className="h-1 w-full bg-cyberdeus-progress rounded-none overflow-hidden">
              <div className="h-full bg-purple-card relative" style={{ width: '18%' }}>
                <div className="absolute w-2 h-6 bg-purple-card top-[-10px] right-0"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-cyberdeus-gray mt-1">
              <span>0</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
              <span>50</span>
              <span>60</span>
              <span>70</span>
              <span>80</span>
              <span>90</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 