class GistManager {
    constructor() {
        this.gistId = localStorage.getItem('gistId') || '';
        this.githubToken = localStorage.getItem('githubToken') || '';
    }

    async saveData(data) {
        this.showLoading();
        try {
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    files: {
                        'campaigns.json': {
                            content: JSON.stringify(data)
                        }
                    }
                })
            });

            if (!response.ok) throw new Error('Salvataggio fallito');
            return await response.json();
        } finally {
            this.hideLoading();
        }
    }

    async loadData() {
        this.showLoading();
        try {
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) throw new Error('Caricamento fallito');
            const data = await response.json();
            return JSON.parse(data.files['campaigns.json'].content);
        } finally {
            this.hideLoading();
        }
    }

    async deleteGist() {
        this.showLoading();
        try {
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `token ${this.githubToken}`
                }
            });

            if (!response.ok) throw new Error('Cancellazione fallita');
            return true;
        } finally {
            this.hideLoading();
        }
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
    }

    validateCredentials() {
        return this.gistId && this.githubToken;
    }
}

const gistManager = new GistManager();