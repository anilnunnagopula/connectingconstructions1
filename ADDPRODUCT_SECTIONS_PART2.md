# AddProduct Enhanced - Remaining Sections (Part 2)

Insert these sections AFTER the Pricing & Inventory section and BEFORE the Submit button:

```jsx
{/* SECTION 3: BRAND & QUALITY */}
<SectionCard
  icon={Award}
  title="Brand & Quality Information"
  expanded={expandedSections.brand}
  onToggle={() => toggleSection("brand")}
>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Brand
      </label>
      {product.category && BRANDS[product.category] ? (
        <select
          value={product.brand}
          onChange={(e) => handleChange("brand", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select Brand</option>
          {BRANDS[product.category].map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
          <option value="other">Other (Enter manually)</option>
        </select>
      ) : (
        <input
          type="text"
          value={product.brand}
          onChange={(e) => handleChange("brand", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="e.g., UltraTech, Tata"
        />
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Grade / Quality
      </label>
      <input
        type="text"
        value={product.grade}
        onChange={(e) => handleChange("grade", e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        placeholder="e.g., OPC 43, Fe415, M-Sand"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Packaging
      </label>
      <input
        type="text"
        value={product.packaging}
        onChange={(e) => handleChange("packaging", e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        placeholder="e.g., 50kg bag, Loose, Bundled"
      />
    </div>
  </div>
</SectionCard>

{/* SECTION 4: TECHNICAL SPECIFICATIONS */}
<SectionCard
  icon={FileText}
  title="Technical Specifications"
  expanded={expandedSections.specs}
  onToggle={() => toggleSection("specs")}
>
  <div className="space-y-4">
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
      <div className="flex items-start gap-2">
        <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900 dark:text-blue-200">
          Add technical specifications like compressive strength, fineness, tensile strength, etc.
          These help customers understand product quality and suitability.
        </p>
      </div>
    </div>

    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Specification Name (e.g., Compressive Strength)"
          value={newSpec.key}
          onChange={(e) => setNewSpec(prev => ({ ...prev, key: e.target.value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Value (e.g., 43 MPa)"
          value={newSpec.value}
          onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        />
        <button
          type="button"
          onClick={addSpecification}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Spec
        </button>
      </div>

      {Object.keys(product.specifications).length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Added Specifications:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{key}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeSpecification(key)}
                  className="text-red-600 hover:text-red-800 ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</SectionCard>

{/* SECTION 5: PRODUCT VARIANTS */}
<SectionCard
  icon={Package}
  title="Product Variants (Sizes, Colors, Finishes)"
  expanded={expandedSections.variants}
  onToggle={() => toggleSection("variants")}
>
  <div className="space-y-4">
    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
      <div className="flex items-start gap-2">
        <Info size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-900 dark:text-yellow-200">
          Add variants like different sizes (25kg/50kg), diameters (8mm/10mm/12mm), or colors.
          Each variant can have its own price adjustment and stock level.
        </p>
      </div>
    </div>

    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Variant Name (e.g., "Size", "Diameter", "Color")
        </label>
        <input
          type="text"
          value={newVariant.name}
          onChange={(e) => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Weight, Diameter, Color"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Variant Options
        </label>
        {newVariant.options.map((option, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 bg-white dark:bg-gray-700 rounded-lg">
            <input
              type="text"
              placeholder="Value (e.g., 25kg)"
              value={option.value}
              onChange={(e) => updateVariantOption(index, "value", e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
            />
            <input
              type="number"
              placeholder="Price +/- (₹)"
              value={option.priceAdjustment}
              onChange={(e) => updateVariantOption(index, "priceAdjustment", parseFloat(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
            />
            <input
              type="number"
              placeholder="Stock"
              value={option.stockQuantity}
              onChange={(e) => updateVariantOption(index, "stockQuantity", parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
            />
            <input
              type="text"
              placeholder="SKU (optional)"
              value={option.sku}
              onChange={(e) => updateVariantOption(index, "sku", e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => removeVariantOption(index)}
              className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addVariantOption}
          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:border-blue-500 hover:text-blue-600 transition"
        >
          + Add Option
        </button>
      </div>

      <button
        type="button"
        onClick={addVariant}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Add Variant
      </button>
    </div>

    {product.variants.length > 0 && (
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Added Variants:</p>
        {product.variants.map((variant, vIndex) => (
          <div key={vIndex} className="bg-white dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-gray-900 dark:text-white">{variant.name}</h5>
              <button
                type="button"
                onClick={() => removeVariant(vIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {variant.options.map((opt, oIndex) => (
                <div key={oIndex} className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
                  <p className="font-medium text-gray-900 dark:text-white">{opt.value}</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {opt.priceAdjustment > 0 ? `+₹${opt.priceAdjustment}` : opt.priceAdjustment < 0 ? `-₹${Math.abs(opt.priceAdjustment)}` : "Base price"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Stock: {opt.stockQuantity}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</SectionCard>

{/* SECTION 6: CERTIFICATIONS & COMPLIANCE */}
<SectionCard
  icon={Award}
  title="Certifications & Compliance"
  expanded={expandedSections.certs}
  onToggle={() => toggleSection("certs")}
>
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Certifications (Select all that apply)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {CERTIFICATIONS.map((cert) => (
          <label
            key={cert}
            className="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <input
              type="checkbox"
              checked={product.certifications.includes(cert)}
              onChange={() => toggleCertification(cert)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-900 dark:text-white">{cert}</span>
          </label>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Manufacturing Date
        </label>
        <input
          type="date"
          value={product.manufacturingDate}
          onChange={(e) => handleChange("manufacturingDate", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Batch Number
        </label>
        <input
          type="text"
          value={product.batchNumber}
          onChange={(e) => handleChange("batchNumber", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="e.g., BATCH2026001"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Warranty
        </label>
        <input
          type="text"
          value={product.warranty}
          onChange={(e) => handleChange("warranty", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="e.g., 1 year, 6 months, No warranty"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Country of Origin
        </label>
        <input
          type="text"
          value={product.countryOfOrigin}
          onChange={(e) => handleChange("countryOfOrigin", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="India"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          HSN Code (for GST)
        </label>
        <input
          type="text"
          value={product.hsnCode}
          onChange={(e) => handleChange("hsnCode", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="Auto-filled based on category"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          GST Rate (%)
        </label>
        <select
          value={product.gstRate}
          onChange={(e) => handleChange("gstRate", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="0">0% (Exempt)</option>
          <option value="5">5%</option>
          <option value="12">12%</option>
          <option value="18">18%</option>
          <option value="28">28%</option>
        </select>
      </div>
    </div>
  </div>
</SectionCard>

{/* SECTION 7: IMAGES & LOCATION */}
<SectionCard
  icon={ImageIcon}
  title="Images & Location"
  expanded={expandedSections.images}
  onToggle={() => toggleSection("images")}
>
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Product Images (Max 6)
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      />
      {product.imageFiles.length > 0 && (
        <p className="text-sm text-green-600 mt-2">
          {product.imageFiles.length} image(s) selected
        </p>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Contact Mobile *
        </label>
        <input
          type="tel"
          required
          value={product.contact.mobile}
          onChange={(e) => handleContactChange("mobile", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="+91 98765 43210"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Contact Email *
        </label>
        <input
          type="email"
          required
          value={product.contact.email}
          onChange={(e) => handleContactChange("email", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="supplier@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Location Text *
        </label>
        <input
          type="text"
          required
          value={product.location.text}
          onChange={(e) => handleChange("location", { ...product.location, text: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="City, State"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Address *
      </label>
      <textarea
        required
        rows={2}
        value={product.contact.address}
        onChange={(e) => handleContactChange("address", e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        placeholder="Complete address with pincode"
      />
    </div>
  </div>
</SectionCard>
```

This completes all the remaining sections!
