package datasources

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

// SupabaseREST represents a client for the Supabase REST API
type SupabaseREST struct {
	ProjectURL string
	APIKey     string
	Client     *http.Client
}

func NewSupabaseREST() *SupabaseREST {
	return &SupabaseREST{
		ProjectURL: os.Getenv("SUPABASE_URL"),
		APIKey:     os.Getenv("SUPABASE_API_KEY"),
		Client: &http.Client{
			Timeout: time.Second * 30,
		},
	}
}

func (s *SupabaseREST) Query(table string, method string, queryParams string, body interface{}) ([]byte, error) {
	url := fmt.Sprintf("%s/rest/v1/%s%s", s.ProjectURL, table, queryParams)

	var req *http.Request
	var err error

	if body != nil {
		jsonData, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal request body: %w", err)
		}
		req, err = http.NewRequest(method, url, bytes.NewBuffer(jsonData))
		if err != nil {
			return nil, fmt.Errorf("failed to create request: %w", err)
		}
	} else {
		req, err = http.NewRequest(method, url, nil)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Add required headers
	req.Header.Set("apikey", s.APIKey)
	req.Header.Set("Authorization", "Bearer "+s.APIKey)

	if method == http.MethodPost || method == http.MethodPut || method == http.MethodPatch {
		req.Header.Set("Content-Type", "application/json")
		if method == http.MethodPost {
			req.Header.Set("Prefer", "resolution=merge-duplicates")
		}else {
			req.Header.Set("Prefer", "return=representation")
		}
		
	}

	// Execute request
	resp, err := s.Client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(responseBody))
	}

	return responseBody, nil
}
func (s *SupabaseREST) TestConnection() error {
	url := fmt.Sprintf("%s/rest/v1/?apikey=%s", s.ProjectURL, s.APIKey)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	// Add required headers
	req.Header.Set("apikey", s.APIKey)
	req.Header.Set("Authorization", "Bearer "+s.APIKey)

	// Execute request
	resp, err := s.Client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to connect to Supabase: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("API connection test failed with status %d: %s",
			resp.StatusCode, string(body))
	}

	return nil
}
