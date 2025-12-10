    // ============================================
    // COLOR CONVERTER
    // ============================================
    
    function convertirCouleur() {
      let hex = document.getElementById("hexInput").value.trim().toUpperCase();
      const errorElement = document.getElementById("colorError");
      
      // Reset errors
      errorElement.textContent = "";
      errorElement.classList.remove("success");
      
      // If user enters RGB
      if (hex.startsWith('RGB(') || hex.startsWith('RGBA(')) {
        convertirRGB(hex);
        return;
      }
      
      // Remove # if present
      if (hex.startsWith('#')) {
        hex = hex.substring(1);
      }

      // If 3 characters, expand to 6 (ex: F53 -> FF5533)
      if (hex.length === 3 && /^[0-9A-F]{3}$/.test(hex)) {
        hex = hex.split('').map(c => c + c).join('');
      }

      // Validate
      if (!/^[0-9A-F]{6}$/.test(hex)) {
        errorElement.textContent = "Format invalide. Utilisez : #RRGGBB, #RGB, ou rgb(r,g,b)";
        resetCouleur();
        return;
      }

      // Extract R, G, B
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);

      // Update input with correct format
      document.getElementById("hexInput").value = "#" + hex;

      // Display the color
      document.getElementById("colorBox").style.backgroundColor = "#" + hex;
      document.getElementById("colorBox").style.borderColor = "#" + hex;

      // Display values
      document.getElementById("hexValue").textContent = "#" + hex;
      document.getElementById("rgbValue").textContent = `${r}, ${g}, ${b}`;
      
      // Binary (8 bits)
      const bin = n => n.toString(2).padStart(8, '0');
      document.getElementById("binValue").textContent = `${bin(r)}, ${bin(g)}, ${bin(b)}`;
    }

    function convertirRGB(rgbString) {
      const matches = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/i);
      
      if (!matches) {
        document.getElementById("colorError").textContent = "Format RGB invalide. Utilisez : rgb(255, 87, 51)";
        resetCouleur();
        return;
      }
      
      const r = parseInt(matches[1]);
      const g = parseInt(matches[2]);
      const b = parseInt(matches[3]);
      
      // Validate values
      if ([r, g, b].some(v => v < 0 || v > 255)) {
        document.getElementById("colorError").textContent = "Les valeurs RGB doivent être entre 0 et 255";
        resetCouleur();
        return;
      }
      
      // Convert to hex
      const hex = [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
      
      // Update input
      document.getElementById("hexInput").value = "#" + hex;
      
      // Display the color
      document.getElementById("colorBox").style.backgroundColor = `rgb(${r},${g},${b})`;
      document.getElementById("colorBox").style.borderColor = `rgb(${r},${g},${b})`;
      
      // Display values
      document.getElementById("hexValue").textContent = "#" + hex;
      document.getElementById("rgbValue").textContent = `${r}, ${g}, ${b}`;
      
      // Binary (8 bits)
      const bin = n => n.toString(2).padStart(8, '0');
      document.getElementById("binValue").textContent = `${bin(r)}, ${bin(g)}, ${bin(b)}`;
      
      document.getElementById("colorError").textContent = "";
    }

    function genererAleatoire() {
      const randomHex = Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
        .toUpperCase();
      document.getElementById("hexInput").value = "#" + randomHex;
      convertirCouleur();
    }

    function copierHex() {
      const hexValue = document.getElementById("hexValue").textContent;
      if (hexValue !== "—") {
        navigator.clipboard.writeText(hexValue)
          .then(() => {
            const errorElement = document.getElementById("colorError");
            errorElement.textContent = "✅ Code HEX copié dans le presse-papier !";
            errorElement.classList.add("success");
            setTimeout(() => {
              errorElement.textContent = "";
              errorElement.classList.remove("success");
            }, 2000);
          })
          .catch(err => {
            console.error('Erreur de copie : ', err);
            document.getElementById("colorError").textContent = "❌ Erreur lors de la copie";
          });
      }
    }

    function resetCouleur() {
      document.getElementById("colorBox").style.backgroundColor = "#f5f5f5";
      document.getElementById("colorBox").style.borderColor = "#ddd";
      document.getElementById("hexValue").textContent = "—";
      document.getElementById("rgbValue").textContent = "—";
      document.getElementById("binValue").textContent = "—";
    }

    // ============================================
    // DECIMAL → BINARY CONVERTER
    // ============================================
    
    function convertirDecimal() {
      const decimalInput = document.getElementById("decimalInput");
      const decimalValue = decimalInput.value.trim();
      const errorElement = document.getElementById("binaryError");
      const explanationDiv = document.getElementById("binaryExplanation");
      const stepsDiv = document.getElementById("binarySteps");
      
      // Reset
      errorElement.textContent = "";
      explanationDiv.style.display = "none";
      
      // Validation
      if (decimalValue === "") {
        errorElement.textContent = "⚠️ Veuillez entrer un nombre";
        return;
      }
      
      const decimal = parseInt(decimalValue);
      
      if (isNaN(decimal) || decimal < 0) {
        errorElement.textContent = "❌ Veuillez entrer un nombre positif";
        return;
      }
      
      if (decimal > 1000000) {
        errorElement.textContent = "⚠️ Le nombre est très grand, le calcul peut être lent";
      }
      
      // Conversion
      let binary = "";
      let temp = decimal;
      let steps = [];
      
      if (decimal === 0) {
        binary = "0";
        steps.push("0 ÷ 2 = 0 reste 0");
      } else {
        while (temp > 0) {
          const remainder = temp % 2;
          const quotient = Math.floor(temp / 2);
          steps.push(`${temp} ÷ 2 = ${quotient} reste ${remainder}`);
          binary = remainder + binary;
          temp = quotient;
        }
      }
      
      // Display results
      document.getElementById("decimalValue").textContent = decimal.toLocaleString();
      document.getElementById("binaryResult").textContent = binary || "0";
      document.getElementById("bitCount").textContent = binary.length + " bits";
      
      // Animation
      document.getElementById("binaryResult").classList.remove("fade-in");
      setTimeout(() => {
        document.getElementById("binaryResult").classList.add("fade-in");
      }, 10);
      
      // Display steps
      if (steps.length > 0) {
        stepsDiv.innerHTML = "<p><strong>Étapes de conversion :</strong></p>" + 
          steps.map((step, index) => 
            `<p>${index + 1}. ${step}</p>`
          ).join('');
        explanationDiv.style.display = "block";
      }
      
      // Clear error if everything is OK
      errorElement.textContent = "";
    }

    function genererDecimalAleatoire() {
      const randomDecimal = Math.floor(Math.random() * 1000);
      document.getElementById("decimalInput").value = randomDecimal;
      convertirDecimal();
    }

    function effacerDecimal() {
      document.getElementById("decimalInput").value = "";
      document.getElementById("decimalValue").textContent = "—";
      document.getElementById("binaryResult").textContent = "—";
      document.getElementById("bitCount").textContent = "—";
      document.getElementById("binaryError").textContent = "";
      document.getElementById("binaryExplanation").style.display = "none";
    }

    // ============================================
    // EVENTS AND INITIALIZATION
    // ============================================
    
    // Allow conversion with Enter key
    document.getElementById("hexInput").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        convertirCouleur();
      }
    });
    
    document.getElementById("decimalInput").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        convertirDecimal();
      }
    });

    // Generate initial values on load
    window.onload = function() {
      genererAleatoire();
      genererDecimalAleatoire();
      
      // Focus on first field
      document.getElementById("hexInput").focus();
    };