/**
 * Classe para gerenciar a geração de senhas seguras
 */
class PasswordGenerator {
  constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.generatePassword();
  }

  initializeElements() {
    // Elementos principais
    this.passwordInput = document.getElementById("passwordInput");
    this.generateBtn = document.querySelector(".generate-btn");
    this.copyBtn = document.querySelector(".copy-btn");
    this.notification = document.getElementById("notification");

    // Opções
    this.lengthSlider = document.getElementById("length");
    this.lengthValue = document.getElementById("lengthValue");
    this.uppercaseCheckbox = document.getElementById("uppercase");
    this.lowercaseCheckbox = document.getElementById("lowercase");
    this.numbersCheckbox = document.getElementById("numbers");
    this.symbolsCheckbox = document.getElementById("symbols");

    // Indicador de força
    this.strengthFill = document.getElementById("strengthFill");
    this.strengthText = document.getElementById("strengthText");

    // Conjuntos de caracteres
    this.charSets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };
  }

  setupEventListeners() {
    this.generateBtn.addEventListener("click", () => this.generatePassword());
    this.copyBtn.addEventListener("click", () => this.copyToClipboard());
    this.lengthSlider.addEventListener("input", (e) => {
      this.lengthValue.textContent = e.target.value;
      this.generatePassword();
    });

    // Gerar nova senha ao mudar opções
    [this.uppercaseCheckbox, this.lowercaseCheckbox, this.numbersCheckbox, this.symbolsCheckbox].forEach(
      (checkbox) => {
        checkbox.addEventListener("change", () => this.generatePassword());
      }
    );
  }

  getCharacterSet() {
    let chars = "";
    if (this.uppercaseCheckbox.checked) chars += this.charSets.uppercase;
    if (this.lowercaseCheckbox.checked) chars += this.charSets.lowercase;
    if (this.numbersCheckbox.checked) chars += this.charSets.numbers;
    if (this.symbolsCheckbox.checked) chars += this.charSets.symbols;
    return chars || this.charSets.lowercase; // Fallback para minúsculas
  }

  generatePassword() {
    const length = parseInt(this.lengthSlider.value);
    const chars = this.getCharacterSet();
    let password = "";

    // Gerar senha com criptografia melhorada
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    this.passwordInput.value = password;
    this.updateStrengthIndicator(password);
  }

  updateStrengthIndicator(password) {
    const strength = this.calculatePasswordStrength(password);
    const strengthLevels = [
      { level: "Fraca", color: "#ef4444", fill: 33 },
      { level: "Média", color: "#f97316", fill: 66 },
      { level: "Forte", color: "#84cc16", fill: 100 },
    ];

    const currentLevel = strengthLevels[strength - 1] || strengthLevels[0];
    this.strengthFill.style.width = `${currentLevel.fill}%`;
    this.strengthFill.style.backgroundColor = currentLevel.color;
    this.strengthText.textContent = currentLevel.level;
  }

  calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) strength++;

    return Math.min(Math.ceil(strength / 2), 3); // Retorna 1, 2 ou 3
  }

  async copyToClipboard() {
    if (!this.passwordInput.value) return;

    try {
      await navigator.clipboard.writeText(this.passwordInput.value);
      this.showNotification("✓ Senha copiada!");
    } catch (err) {
      // Fallback para navegadores antigos
      this.passwordInput.select();
      this.passwordInput.setSelectionRange(0, 99999);
      document.execCommand("copy");
      this.showNotification("✓ Senha copiada!");
    }
  }

  showNotification(message) {
    this.notification.textContent = message;
    this.notification.classList.add("show");
    setTimeout(() => this.notification.classList.remove("show"), 2000);
  }
}

// Inicializar aplicação quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  new PasswordGenerator();
});