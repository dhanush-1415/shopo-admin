import { Ruler, Scale, Circle } from 'lucide-react';

export default function SizeChart() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3 text-gray-900">
          <Ruler className="h-8 w-8 text-blue-600" />
          Men's Size Chart
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Comprehensive size guide for topwear and bottomwear based on Indian standards
        </p>
      </div>

      {/* Measurement Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-100 px-6 py-4 border-b border-blue-200">
          <h2 className="text-blue-900 flex items-center gap-2 text-xl font-bold">
            <Ruler className="h-5 w-5" />
            How to Measure Yourself
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm font-semibold text-blue-900 mb-3">
            Follow these simple steps to get accurate measurements:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div className="flex items-start gap-2 bg-white p-4 rounded-lg shadow-sm">
              <Circle className="h-4 w-4 fill-blue-400 stroke-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block">Chest:</strong>
                <span className="text-xs text-blue-700">Measure around the fullest part of your chest, keeping the tape under your arms</span>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-white p-4 rounded-lg shadow-sm">
              <Circle className="h-4 w-4 fill-blue-400 stroke-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block">Waist:</strong>
                <span className="text-xs text-blue-700">Measure around your natural waistline, keeping the tape comfortably loose</span>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-white p-4 rounded-lg shadow-sm">
              <Circle className="h-4 w-4 fill-blue-400 stroke-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block">Length:</strong>
                <span className="text-xs text-blue-700">Measure from the highest point of your shoulder down to the desired hem length</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-100 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 space-y-1">
              <strong className="block mb-2">Important Notes:</strong>
              <span className="block">• All measurements are <strong>body measurements</strong> in inches (1 inch = 2.54 cm)</span>
              <span className="block">• If you're between sizes, go <strong>one size up</strong> for a looser, more comfortable fit</span>
              <span className="block">• Based on Indian size standards</span>
              <span className="block">• For best results, measure over light clothing</span>
            </p>
          </div>
        </div>
      </div>

      {/* Topwear Size Chart */}
      <div className="bg-green-50 border-2 border-green-300 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-100 to-green-50 px-6 py-4 border-b border-green-200">
          <h2 className="text-green-900 flex items-center gap-2 text-xl font-bold">
            <Ruler className="h-5 w-5" />
            Men's Topwear – Regular Fit
          </h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-green-800 mb-4 font-medium">
            Includes: T-Shirts, Shirts, Sweatshirts, Jackets, Hoodies, etc.
          </p>
          <div className="overflow-x-auto rounded-lg border border-green-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-100">
                  <th className="text-green-900 font-bold py-3 px-4 text-left">Size</th>
                  <th className="text-green-900 font-bold py-3 px-4 text-left">Chest (inches)</th>
                  <th className="text-green-900 font-bold py-3 px-4 text-left">Shoulder (inches)</th>
                  <th className="text-green-900 font-bold py-3 px-4 text-left">Length (inches)*</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-green-100 hover:bg-green-50">
                  <td className="font-bold text-green-900 py-3 px-4">XS</td>
                  <td className="py-3 px-4">34-36</td>
                  <td className="py-3 px-4">16.5</td>
                  <td className="py-3 px-4">24-25</td>
                </tr>
                <tr className="border-b border-green-100 hover:bg-green-50">
                  <td className="font-bold text-green-900 py-3 px-4">S</td>
                  <td className="py-3 px-4">36-38</td>
                  <td className="py-3 px-4">17.5</td>
                  <td className="py-3 px-4">25-26</td>
                </tr>
                <tr className="border-b border-green-100 hover:bg-green-50">
                  <td className="font-bold text-green-900 py-3 px-4">M</td>
                  <td className="py-3 px-4">38-40</td>
                  <td className="py-3 px-4">18.5</td>
                  <td className="py-3 px-4">26-27</td>
                </tr>
                <tr className="border-b border-green-100 hover:bg-green-50">
                  <td className="font-bold text-green-900 py-3 px-4">L</td>
                  <td className="py-3 px-4">40-42</td>
                  <td className="py-3 px-4">19</td>
                  <td className="py-3 px-4">27-28</td>
                </tr>
                <tr className="border-b border-green-100 hover:bg-green-50">
                  <td className="font-bold text-green-900 py-3 px-4">XL</td>
                  <td className="py-3 px-4">42-44</td>
                  <td className="py-3 px-4">20</td>
                  <td className="py-3 px-4">28-29</td>
                </tr>
                <tr className="border-b border-green-100 hover:bg-green-50">
                  <td className="font-bold text-green-900 py-3 px-4">XXL</td>
                  <td className="py-3 px-4">44-46</td>
                  <td className="py-3 px-4">21</td>
                  <td className="py-3 px-4">29-30</td>
                </tr>
                <tr className="border-b border-green-100 hover:bg-green-50">
                  <td className="font-bold text-green-900 py-3 px-4">3XL</td>
                  <td className="py-3 px-4">46-48</td>
                  <td className="py-3 px-4">22</td>
                  <td className="py-3 px-4">30-31</td>
                </tr>
                <tr className="hover:bg-green-50">
                  <td className="font-bold text-green-900 py-3 px-4">4XL</td>
                  <td className="py-3 px-4">48-50</td>
                  <td className="py-3 px-4">23</td>
                  <td className="py-3 px-4">31-32</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-xs text-green-800">
              <strong>*Length:</strong> Measured from the highest shoulder point to the hem of the garment
            </p>
            <p className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">
              <strong>Note:</strong> These measurements are body measurements. The actual garment will have additional ease for comfort and movement.
            </p>
          </div>
        </div>
      </div>

      {/* Bottomwear Size Chart */}
      <div className="bg-blue-50 border-2 border-blue-300 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4 border-b border-blue-200">
          <h2 className="text-blue-900 flex items-center gap-2 text-xl font-bold">
            <Ruler className="h-5 w-5" />
            Men's Bottomwear – Regular Fit
          </h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-blue-800 mb-4 font-medium">
            Includes: Jeans, Trousers, Chinos, Shorts, Joggers, Track Pants, etc.
          </p>
          <div className="overflow-x-auto rounded-lg border border-blue-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-100">
                  <th className="text-blue-900 font-bold py-3 px-4 text-left">Size (Indian)</th>
                  <th className="text-blue-900 font-bold py-3 px-4 text-left">Alpha Size</th>
                  <th className="text-blue-900 font-bold py-3 px-4 text-left">Waist (inches)</th>
                  <th className="text-blue-900 font-bold py-3 px-4 text-left">Inseam (approx)</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-blue-100 hover:bg-blue-50">
                  <td className="font-bold text-blue-900 py-3 px-4">28</td>
                  <td className="py-3 px-4">XS</td>
                  <td className="py-3 px-4">28</td>
                  <td className="py-3 px-4">~32″</td>
                </tr>
                <tr className="border-b border-blue-100 hover:bg-blue-50">
                  <td className="font-bold text-blue-900 py-3 px-4">30</td>
                  <td className="py-3 px-4">S</td>
                  <td className="py-3 px-4">30</td>
                  <td className="py-3 px-4">~32″</td>
                </tr>
                <tr className="border-b border-blue-100 hover:bg-blue-50">
                  <td className="font-bold text-blue-900 py-3 px-4">32</td>
                  <td className="py-3 px-4">M</td>
                  <td className="py-3 px-4">32</td>
                  <td className="py-3 px-4">~32″</td>
                </tr>
                <tr className="border-b border-blue-100 hover:bg-blue-50">
                  <td className="font-bold text-blue-900 py-3 px-4">34</td>
                  <td className="py-3 px-4">L</td>
                  <td className="py-3 px-4">34</td>
                  <td className="py-3 px-4">~32″</td>
                </tr>
                <tr className="border-b border-blue-100 hover:bg-blue-50">
                  <td className="font-bold text-blue-900 py-3 px-4">36</td>
                  <td className="py-3 px-4">XL</td>
                  <td className="py-3 px-4">36</td>
                  <td className="py-3 px-4">~32″</td>
                </tr>
                <tr className="border-b border-blue-100 hover:bg-blue-50">
                  <td className="font-bold text-blue-900 py-3 px-4">38</td>
                  <td className="py-3 px-4">XXL</td>
                  <td className="py-3 px-4">38</td>
                  <td className="py-3 px-4">~32″</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="font-bold text-blue-900 py-3 px-4">40</td>
                  <td className="py-3 px-4">3XL</td>
                  <td className="py-3 px-4">40</td>
                  <td className="py-3 px-4">~32″</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-blue-100 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 space-y-1">
              <strong className="block mb-2">Fit Variations:</strong>
              <span className="block text-xs">• <strong>Slim Fit:</strong> Waist measurement is relaxed waist (add 1-2 inches for comfort)</span>
              <span className="block text-xs">• <strong>Relaxed Fit:</strong> Measurements may be looser by 2-3 inches</span>
              <span className="block text-xs">• <strong>Shorts:</strong> Inseam typically ~8-10 inches</span>
              <span className="block text-xs">• <strong>Joggers:</strong> Inseam typically ~28-30 inches</span>
              <span className="block text-xs mt-2">Please refer to the specific product page for exact fit type and measurements.</span>
            </p>
          </div>
        </div>
      </div>

      {/* International Size Equivalents */}
      <div className="bg-purple-50 border-2 border-purple-300 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-100 to-purple-50 px-6 py-4 border-b border-purple-200">
          <h2 className="text-purple-900 flex items-center gap-2 text-xl font-bold">
            <Scale className="h-5 w-5" />
            International Size Equivalents
          </h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-purple-800 mb-4">
            Compare Indian sizes with international standards
          </p>
          <div className="overflow-x-auto rounded-lg border border-purple-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-purple-100">
                  <th className="text-purple-900 font-bold py-3 px-4 text-left">Indian Size</th>
                  <th className="text-purple-900 font-bold py-3 px-4 text-left">US Size</th>
                  <th className="text-purple-900 font-bold py-3 px-4 text-left">UK Size</th>
                  <th className="text-purple-900 font-bold py-3 px-4 text-left">EU Size</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-purple-100 hover:bg-purple-50">
                  <td className="font-bold text-purple-900 py-3 px-4">XS</td>
                  <td className="py-3 px-4">34</td>
                  <td className="py-3 px-4">34</td>
                  <td className="py-3 px-4">44</td>
                </tr>
                <tr className="border-b border-purple-100 hover:bg-purple-50">
                  <td className="font-bold text-purple-900 py-3 px-4">S</td>
                  <td className="py-3 px-4">36</td>
                  <td className="py-3 px-4">36</td>
                  <td className="py-3 px-4">46</td>
                </tr>
                <tr className="border-b border-purple-100 hover:bg-purple-50">
                  <td className="font-bold text-purple-900 py-3 px-4">M</td>
                  <td className="py-3 px-4">38</td>
                  <td className="py-3 px-4">38</td>
                  <td className="py-3 px-4">48</td>
                </tr>
                <tr className="border-b border-purple-100 hover:bg-purple-50">
                  <td className="font-bold text-purple-900 py-3 px-4">L</td>
                  <td className="py-3 px-4">40</td>
                  <td className="py-3 px-4">40</td>
                  <td className="py-3 px-4">50</td>
                </tr>
                <tr className="border-b border-purple-100 hover:bg-purple-50">
                  <td className="font-bold text-purple-900 py-3 px-4">XL</td>
                  <td className="py-3 px-4">42</td>
                  <td className="py-3 px-4">42</td>
                  <td className="py-3 px-4">52</td>
                </tr>
                <tr className="border-b border-purple-100 hover:bg-purple-50">
                  <td className="font-bold text-purple-900 py-3 px-4">XXL</td>
                  <td className="py-3 px-4">44</td>
                  <td className="py-3 px-4">44</td>
                  <td className="py-3 px-4">54</td>
                </tr>
                <tr className="border-b border-purple-100 hover:bg-purple-50">
                  <td className="font-bold text-purple-900 py-3 px-4">3XL</td>
                  <td className="py-3 px-4">46</td>
                  <td className="py-3 px-4">46</td>
                  <td className="py-3 px-4">56</td>
                </tr>
                <tr className="hover:bg-purple-50">
                  <td className="font-bold text-purple-900 py-3 px-4">4XL</td>
                  <td className="py-3 px-4">48</td>
                  <td className="py-3 px-4">48</td>
                  <td className="py-3 px-4">58</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Measurement Conversion Table */}
      <div className="bg-gray-50 border-2 border-gray-300 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-gray-900 flex items-center gap-2 text-xl font-bold">
            <Scale className="h-5 w-5" />
            Measurement Conversion (Inches ↔ Centimeters)
          </h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-4">
            Quick reference for converting between inches and centimeters
          </p>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-gray-900 font-bold py-3 px-4 text-left">Inches</th>
                  <th className="text-gray-900 font-bold py-3 px-4 text-left">Centimeters (cm)</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="font-bold text-gray-900 py-3 px-4">1″</td>
                  <td className="py-3 px-4">2.54 cm</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="font-bold text-gray-900 py-3 px-4">28″</td>
                  <td className="py-3 px-4">71.1 cm</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="font-bold text-gray-900 py-3 px-4">30″</td>
                  <td className="py-3 px-4">76.2 cm</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="font-bold text-gray-900 py-3 px-4">32″</td>
                  <td className="py-3 px-4">81.3 cm</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="font-bold text-gray-900 py-3 px-4">34″</td>
                  <td className="py-3 px-4">86.4 cm</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="font-bold text-gray-900 py-3 px-4">36″</td>
                  <td className="py-3 px-4">91.4 cm</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="font-bold text-gray-900 py-3 px-4">38″</td>
                  <td className="py-3 px-4">96.5 cm</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="font-bold text-gray-900 py-3 px-4">40″</td>
                  <td className="py-3 px-4">101.6 cm</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="font-bold text-gray-900 py-3 px-4">42″</td>
                  <td className="py-3 px-4">106.7 cm</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="font-bold text-gray-900 py-3 px-4">44″</td>
                  <td className="py-3 px-4">111.8 cm</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="font-bold text-gray-900 py-3 px-4">46″</td>
                  <td className="py-3 px-4">116.8 cm</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="font-bold text-gray-900 py-3 px-4">48″</td>
                  <td className="py-3 px-4">121.9 cm</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="font-bold text-gray-900 py-3 px-4">50″</td>
                  <td className="py-3 px-4">127.0 cm</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-3 bg-gray-100 p-2 rounded">
            <strong>Quick Formula:</strong> Inches × 2.54 = Centimeters | Centimeters ÷ 2.54 = Inches
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Circle className="h-4 w-4 fill-blue-500 stroke-blue-700" />
          Need Help?
        </h3>
        <p className="text-sm text-gray-700 mb-2">
          Still unsure about your size? Here are some tips:
        </p>
        <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
          <li>Check the product-specific size chart on each item page for exact garment measurements</li>
          <li>Read customer reviews for fit feedback</li>
          <li>Contact our customer support team for personalized sizing assistance</li>
          <li>When in doubt, size up for a more comfortable fit</li>
        </ul>
      </div>
    </div>
  );
}